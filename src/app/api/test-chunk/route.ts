import { NextResponse } from 'next/server'
import { chunkText } from '@/lib/chunking'

export const runtime = 'nodejs'

/**
 * Test route for chunking. Uses a synthetic multi-paragraph input
 * so we can verify the splitter behaves sensibly without needing a PDF.
 *
 * Hit: http://localhost:3000/api/test-chunk
 *
 * Expected: several chunks of ~1000 chars each, with overlap between
 * consecutive chunks, and paragraph boundaries respected where possible.
 */
export async function GET() {
  const paragraph = (n: number, sentencesPerPara = 8) =>
    Array.from({ length: sentencesPerPara }, (_, i) =>
      `This is sentence ${i + 1} of paragraph ${n}, containing enough words to make each paragraph substantial and force the splitter to work through multiple chunks of text.`
    ).join(' ')

  const testText = Array.from({ length: 20 }, (_, i) => paragraph(i + 1)).join('\n\n')

  const chunks = await chunkText(testText)

  return NextResponse.json({
    ok: true,
    inputLength: testText.length,
    chunkCount: chunks.length,
    chunkSizes: chunks.map((c) => c.content.length),
    firstChunkPreview: chunks[0]?.content.slice(0, 200) + '...',
    firstChunkTail: '...' + (chunks[0]?.content.slice(-200) ?? ''),
    secondChunkHead: (chunks[1]?.content.slice(0, 200) ?? '') + '...',
  })
}
