import { NextResponse } from 'next/server'
import { extractText, getDocumentProxy } from 'unpdf'
import { randomUUID } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase-server'
import { chunkText } from '@/lib/chunking'
import { generateEmbeddings } from '@/lib/embeddings'


export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024
const INSERT_BATCH_SIZE = 100

export async function POST(req: Request) {
  try {
    // ── 1. Receive and validate the file ────────────────────────────
    const formData = await req.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 })
    }

    // ── 2. Buffer the file ──────────────────────────────────────────
    const buffer = Buffer.from(await file.arrayBuffer())

    // ── 3. Extract text using pdf-parse v2 API ──────────────────────
    // v2 exports a PDFParse class, NOT a default function.
    // We must instantiate it, call getText() for the text, and
    // getInfo() for the page count, then destroy() to free resources.
        // ── 3. Extract text using unpdf ─────────────────────────────────
    const uint8 = new Uint8Array(buffer)
    const pdf = await getDocumentProxy(uint8)
    const { text, totalPages } = await extractText(pdf, { mergePages: true })

    const rawText = text
    const numPages: number = totalPages ?? 1

    // ── 4. Clean the raw text ───────────────────────────────────────
    const cleanedText = cleanText(rawText)

    if (cleanedText.length < 50) {
      return NextResponse.json(
        { error: 'PDF contains no extractable text. Scanned image PDFs are not supported.' },
        { status: 400 }
      )
    }

    // ── 5. Chunk ────────────────────────────────────────────────────
    const chunks = await chunkText(cleanedText)
    if (chunks.length === 0) {
      return NextResponse.json({ error: 'No chunks produced from PDF' }, { status: 400 })
    }

    // ── 6. Embed ────────────────────────────────────────────────────
    const texts = chunks.map((c) => c.content)
    const embeddings = await generateEmbeddings(texts)

    if (embeddings.length !== chunks.length) {
      throw new Error(
        `Embedding count mismatch: got ${embeddings.length} for ${chunks.length} chunks`
      )
    }

    // ── 7. Build DB rows ────────────────────────────────────────────
    const documentId = randomUUID()
    const rows = chunks.map((chunk, i) => ({
      document_id: documentId,
      content: chunk.content,
      page_number: estimatePage(chunk.chunkIndex, chunks.length, numPages),
      chunk_index: chunk.chunkIndex,
      embedding: embeddings[i],
    }))

    // ── 8. Insert in batches ────────────────────────────────────────
    for (let i = 0; i < rows.length; i += INSERT_BATCH_SIZE) {
      const batch = rows.slice(i, i + INSERT_BATCH_SIZE)
      const { error } = await supabaseAdmin.from('chunks').insert(batch)
      if (error) throw new Error(`Insert failed: ${error.message}`)
    }

    return NextResponse.json({
      ok: true,
      documentId,
      filename: file.name,
      pages: numPages,
      chunks: chunks.length,
    })
  } catch (err) {
    console.error('Upload failed:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

function cleanText(text: string): string {
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*\d+\s*$/gm, '')
    .replace(/Page \d+\s+of\s+\d+/gi, '')
    .replace(/\t/g, ' ')
    .replace(/ {2,}/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
    .trim()
}

function estimatePage(chunkIndex: number, totalChunks: number, totalPages: number): number {
  if (totalPages <= 1) return 1
  const ratio = chunkIndex / Math.max(1, totalChunks - 1)
  return Math.min(totalPages, Math.max(1, Math.round(ratio * (totalPages - 1)) + 1))
}