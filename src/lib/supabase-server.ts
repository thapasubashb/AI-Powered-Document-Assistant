import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client.
 *
 * Uses the SERVICE_ROLE key, which bypasses Row Level Security.
 * This means it can read/write ALL rows in our database, so it must
 * NEVER be imported into a client component or shipped to the browser.
 *
 * Only import this file from:
 *   - Next.js API routes (src/app/api/**)
 *   - Server actions
 *   - Server components (async components under src/app/, with 'use server' or default)
 *
 * If you import this from a file that has 'use client' at the top, Next.js
 * will throw at build time — that is by design, because it prevents leaking
 * the service_role key to users.
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      // We don't use Supabase Auth in this project. Telling the client
      // not to persist a session avoids pointless work and warnings.
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)