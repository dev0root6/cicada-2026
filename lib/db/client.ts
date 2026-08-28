import "server-only"
import { neon } from "@neondatabase/serverless"

/**
 * Neon over HTTP — no connection pool to exhaust from serverless functions.
 * The connection string is provided by the Vercel Neon integration as
 * DATABASE_URL (POSTGRES_URL is accepted as a fallback for older setups).
 */

function connectionString(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL
}

export function isDatabaseConfigured(): boolean {
  return Boolean(connectionString())
}

export type Row = Record<string, unknown>

/**
 * The driver's tagged template is overloaded and widens to a union that is
 * awkward downstream. Every query here uses the default row-array mode, so
 * narrow it once at the boundary instead of casting at each call site.
 */
type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<Row[]>

let client: ReturnType<typeof neon> | null = null

function connect() {
  const url = connectionString()
  if (!url) {
    throw new Error(
      "No database configured. Set DATABASE_URL (Vercel > Storage > Neon) to enable registrations.",
    )
  }
  client ??= neon(url)
  return client
}

export function getSql(): SqlTag {
  return connect() as unknown as SqlTag
}

/** Multi-statement SQL (migrations); not for user input. */
export async function runRawSql(statements: string): Promise<void> {
  await connect().query(statements)
}
