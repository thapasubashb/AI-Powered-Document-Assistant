import { NextResponse } from 'next/server'
import { generateEmbedding } from '@/lib/embeddings'

export const runtime = 'nodejs'

/**
 * Test route — proves Gemini embedding works end-to-end.
 *
 * Hit it with: http://localhost:3000/api/test-embedding
 *
 * Expected response:
 *   { ok: true, dimension: 768, first5: [...], last5: [...] }
 *
 * If dimension is not 768, the embeddings model is wrong (or the SDK
 * is returning something unexpected). The number 768 must match the
 * vector(768) column in our chunks table.
 */
export async function GET() {
  try {
    const text = 'The quick brown fox jumps over the lazy dog.'
    const embedding = await generateEmbedding(text)

    return NextResponse.json({
      ok: true,
      inputLength: text.length,
      dimension: embedding.length,
      first5: embedding.slice(0, 5),
      last5: embedding.slice(-5),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}