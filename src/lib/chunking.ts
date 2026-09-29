import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

export interface Chunk {
  content: string
  chunkIndex: number
}

/**
 * Split a large text into semantically meaningful chunks.
 *
 * We use RecursiveCharacterTextSplitter because it tries natural
 * boundaries first (paragraphs → lines → sentences → words) and only
 * falls back to mid-word splits when necessary.
 *
 * Sizing notes:
 *   - 1000 characters ≈ 250-350 words ≈ 300-500 tokens
 *     That's the industry sweet spot for retrieval quality.
 *   - 200-char overlap (~20%) ensures that a sentence spanning a chunk
 *     boundary appears fully in at least one chunk.
 */
export async function chunkText(text: string): Promise<Chunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    // Order matters: try the biggest natural boundary first, fall back
    // to smaller ones only if the current chunk still exceeds chunkSize.
   separators: ['. ', '! ', '? ', '\n\n', '\n', ' ', ''],
  })

  const documents = await splitter.createDocuments([text])

  return documents
    .map((doc, index) => ({
      content: doc.pageContent.trim(),
      chunkIndex: index,
    }))
    // Drop chunks that ended up empty after trimming
    .filter((c) => c.content.length > 0)
    // Reindex after filtering so indices are contiguous
    .map((c, index) => ({ ...c, chunkIndex: index }))
}