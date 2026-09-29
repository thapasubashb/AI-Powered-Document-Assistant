import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export const runtime = 'nodejs'

/**
 * Test endpoint — proves the whole stack works:
 *   Next.js → supabase-js → Supabase REST API → Postgres (with RLS bypass)
 *
 * Hit it with: curl http://localhost:3000/api/test-db
 * Or open that URL in the browser.
 *
 * Expected response: { ok: true, chunkCount: 0, ... }
 * If chunkCount is 0, that's correct — we haven't uploaded anything yet.
 */
export async function GET() {
  try {
    // A minimal query: count rows in the chunks table.
    // If RLS were blocking us, this would return an error or count 0 for the wrong reason.
    const { count, error } = await supabaseAdmin
      .from('chunks')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return NextResponse.json(
        { ok: false, stage: 'query', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      chunkCount: count,
      message: 'Supabase connection works. Service role can read chunks table.',
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json(
      { ok: false, stage: 'unexpected', error: message },
      { status: 500 }
    )
  }
}