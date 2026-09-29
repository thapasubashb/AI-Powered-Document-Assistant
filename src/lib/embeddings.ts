import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

/**
 * The embedding model. Must be the SAME model for both:
 *   - PDF chunks at upload time
 *   - User questions at query time
 * Otherwise the vector spaces are incompatible.
 *
 * gemini-embedding-001 replaced text-embedding-004 (deprecated Jan 14, 2026).
 * It outputs 3072 dimensions by default, but we can truncate to 768 via
 * `outputDimensionality`, which is what our database column vector(768) expects.
 */
const EMBEDDING_MODEL = 'gemini-embedding-001'
const EMBEDDING_DIMENSIONS = 768

/**
 * Gemini's embedContent API accepts at most ~100 texts per request.
 * Larger payloads return 400 Bad Request. We batch under that limit.
 */
const BATCH_SIZE = 100

/**
 * Embed a single string. Used for the user's chat question.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
    config: {
      outputDimensionality: EMBEDDING_DIMENSIONS,
    },
  })

  const embedding = response.embeddings?.[0]?.values
  if (!embedding) {
    throw new Error('Gemini returned no embedding for the input text.')
  }
  return embedding
}

/**
 * Embed many strings at once. Used for PDF chunks during upload.
 * Batches automatically so we never exceed the per-request limit.
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const all: number[][] = []

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE)

    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: batch,
      config: {
        outputDimensionality: EMBEDDING_DIMENSIONS,
      },
    })

    const embeddings = response.embeddings
    if (!embeddings || embeddings.length !== batch.length) {
      throw new Error(
        `Gemini returned ${embeddings?.length ?? 0} embeddings for ${batch.length} inputs.`
      )
    }

    for (const e of embeddings) {
      if (!e.values) {
        throw new Error('Gemini returned an embedding with no values.')
      }
      all.push(e.values)
    }
  }

  return all
}