import "server-only"
import { readFile } from "node:fs/promises"
import path from "node:path"
import { getSql, runRawSql } from "./client"

/**
 * Applies lib/db/schema.sql from inside the app, so the database can be set up
 * from the admin console on Vercel without a local CLI. The file is bundled
 * with the admin routes via outputFileTracingIncludes in next.config.mjs.
 * Same splitting rule as scripts/migrate.mjs: schema.sql has no function
 * bodies or string literals containing ";" or "--".
 */
export async function applySchema(): Promise<number> {
  const schema = await readFile(path.join(process.cwd(), "lib/db/schema.sql"), "utf8")
  const statements = schema
    .replace(/--[^\n]*/g, "")
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
  // One statement per call: Neon's HTTP driver rejects multi-statement queries.
  for (const statement of statements) await runRawSql(statement)
  return statements.length
}

export const TABLES = [
  "registrations",
  "admin_users",
  "admin_user_events",
  "registration_interest",
  "site_flags",
  "email_log",
] as const

/** Which of the app's tables exist (true) or are missing (false). */
export async function tableStatus(): Promise<Record<string, boolean>> {
  const sql = getSql()
  const rows = await sql`
    select t.name, to_regclass('public.' || t.name) is not null as present
      from unnest(${TABLES as unknown as string[]}::text[]) as t(name)
  `
  return Object.fromEntries(rows.map((r) => [String(r.name), Boolean(r.present)]))
}
