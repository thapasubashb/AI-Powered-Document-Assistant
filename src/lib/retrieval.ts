import { supabaseAdmin } from '@/lib/supabase-server'
import { generateEmbedding } from '@/lib/embeddings'

export interface RetrievedChunk {
  id: number
  content: string
  page_number: number
  similarity: number
}

/**
 * The shape returned by our `match_chunks` Postgres function.
 * Kept as a separate type because Supabase's TS inference for RPC
 * calls is loose — we assert the shape here.
 */
interface MatchChunksResult {
  id: number
  content: string
  page_number: number
  similarity: number
}

/**
 * Find the chunks in a document that are most semantically similar
 * to the user's question.
 *
 * Steps:
 *   1. Embed the question using the SAME model used for the chunks.
 *   2. Call the `match_chunks` RPC in Supabase, which runs cosine
 *      similarity inside Postgres and returns the top-K rows.
 *
 * The threshold (0.5) filters out weak matches — a chunk scoring
 * below 0.5 has only loose relevance and would pollute the LLM prompt.
 *
 * topK = 4 is the standard sweet spot for RAG Q&A. Too few and we miss
 * the answer; too many and the LLM gets distracted by noise.
 */
export async function retrieveChunks(
  question: string,
  documentId: string,
  options: { topK?: number; threshold?: number } = {}
): Promise<RetrievedChunk[]> {
  const topK = options.topK ?? 4
  const threshold = options.threshold ?? 0.5

  // 1. Embed the question
  const queryEmbedding = await generateEmbedding(question)

  // 2. Call the RPC we defined earlier in the SQL editor
  const { data, error } = await supabaseAdmin.rpc('match_chunks', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: topK,
    p_document_id: documentId,
  })

  if (error) {
    throw new Error(`Retrieval failed: ${error.message}`)
  }

  return (data ?? []) as MatchChunksResult[]
}