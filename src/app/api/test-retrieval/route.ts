import { NextResponse } from 'next/server'
import { retrieveChunks } from '@/lib/retrieval'

export const runtime = 'nodejs'

/**
 * Test route for retrieval.
 *
 * Usage:
 *   http://localhost:3000/api/test-retrieval?documentId=YOUR_ID&q=your+question
 *
 * Returns the top-K chunks from that document that are most similar
 * to your question, along with their cosine similarity scores.
 *
 * This lets you SEE what the RAG system would feed the LLM before we
 * even build the chat endpoint.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const documentId = url.searchParams.get('documentId')
    const question = url.searchParams.get('q')

    if (!documentId) {
      return NextResponse.json({ error: 'Missing ?documentId=...' }, { status: 400 })
    }
    if (!question) {
      return NextResponse.json({ error: 'Missing ?q=...' }, { status: 400 })
    }

    const chunks = await retrieveChunks(question, documentId, {
      topK: 4,
      threshold: 0.5,
    })

    return NextResponse.json({
      ok: true,
      question,
      documentId,
      matchCount: chunks.length,
      results: chunks.map((c) => ({
        id: c.id,
        page: c.page_number,
        similarity: Number(c.similarity.toFixed(4)),
        preview: c.content.slice(0, 200) + (c.content.length > 200 ? '…' : ''),
      })),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}