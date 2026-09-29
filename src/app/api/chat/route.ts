import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { retrieveChunks } from '@/lib/retrieval'

export const runtime = 'nodejs'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

/**
 * Model fallback chain. If the primary model returns 503 (overloaded),
 * we try the next one. Order matters: fastest/cheapest first, then
 * progressively more capable (and slower) models as fallback.
 */
const CHAT_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
]

async function callGeminiWithRetry(
  contents: string,
  systemInstruction: string
): Promise<{ text: string; model: string }> {
  const maxAttemptsPerModel = 3
  let lastError: unknown = null

  for (const model of CHAT_MODELS) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        })

        const text = response.text
        if (text) return { text, model }
        throw new Error('Empty response from model')
      } catch (err) {
        lastError = err
        const msg = err instanceof Error ? err.message : String(err)

        // 503 = overloaded, worth retrying
        // 429 = rate limited, also worth retrying
        // 404 = model doesn't exist, skip to next model immediately
        const isRetryable = msg.includes('503') || msg.includes('UNAVAILABLE') ||
                            msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')

        if (msg.includes('404') || msg.includes('NOT_FOUND')) {
          // This model isn't available; try the next one in the chain
          console.warn(`Model ${model} not found, trying next...`)
          break
        }

        if (isRetryable && attempt < maxAttemptsPerModel) {
          // Exponential backoff: 1s, then 2s
          const delayMs = 1000 * Math.pow(2, attempt - 1)
          console.warn(`${model} returned retryable error (attempt ${attempt}), waiting ${delayMs}ms`)
          await new Promise((r) => setTimeout(r, delayMs))
          continue
        }

        // Non-retryable or out of attempts for this model → try next model
        console.warn(`${model} failed permanently:`, msg.slice(0, 120))
        break
      }
    }
  }

  throw lastError ?? new Error('All models failed')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { message, documentId } = body

    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Missing or empty message' }, { status: 400 })
    }
    if (typeof documentId !== 'string' || !documentId) {
      return NextResponse.json({ error: 'Missing documentId' }, { status: 400 })
    }

    // ── 1. Retrieve relevant chunks ─────────────────────────────────
    const chunks = await retrieveChunks(message, documentId, {
      topK: 4,
      threshold: 0.5,
    })

    // ── 2. Short-circuit if nothing is relevant ─────────────────────
    if (chunks.length === 0) {
      return NextResponse.json({
        ok: true,
        answer: "I don't know based on the document.",
        sources: [],
      })
    }

    // ── 3. Build context block ──────────────────────────────────────
    const context = chunks
      .map((c, i) => `--- Source ${i + 1} (Page ${c.page_number}) ---\n${c.content}`)
      .join('\n\n')

    const systemInstruction = `You are a helpful assistant that answers questions about a document the user has uploaded.

RULES:
1. Answer using ONLY the information in the Context provided in the user's message.
2. If the answer is not present in the Context, respond exactly: "I don't know based on the document."
3. Do not use any outside knowledge.
4. When you reference information, mention the page number (e.g., "on page 16...").
5. Be concise and direct.`

    const userPrompt = `Context:

${context}

User Question: ${message}`

    // ── 4. Call Gemini with retry + fallback ────────────────────────
    const { text: answer } = await callGeminiWithRetry(userPrompt, systemInstruction)

    // ── 5. Return answer + sources for citation ─────────────────────
    return NextResponse.json({
      ok: true,
      answer,
      sources: chunks.map((c, i) => ({
        index: i + 1,
        page: c.page_number,
        similarity: Number(c.similarity.toFixed(4)),
      })),
    })
  } catch (err) {
    console.error('Chat failed:', err)
    const message = err instanceof Error ? err.message : String(err)

    // Translate ugly JSON errors into user-friendly messages
    let friendly = message
    if (message.includes('503') || message.includes('UNAVAILABLE')) {
      friendly = 'The AI model is temporarily overloaded. Please try again in a moment.'
    } else if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
      friendly = "We've hit the API rate limit. Wait a minute and try again."
    }

    return NextResponse.json({ ok: false, error: friendly }, { status: 500 })
  }
}