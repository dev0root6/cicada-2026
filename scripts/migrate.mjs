#!/usr/bin/env node
/** Applies lib/db/schema.sql. Idempotent — safe to re-run. */
import { readFile } from "node:fs/promises"
import { neon } from "@neondatabase/serverless"

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!url) {
  console.error("DATABASE_URL is not set. Add a Neon database in Vercel > Storage.")
  process.exit(1)
}

const schema = await readFile(new URL("../lib/db/schema.sql", import.meta.url), "utf8")

// Neon's HTTP driver runs one statement per call, so strip comments and send
// the statements one by one. schema.sql has no function bodies or string
// literals containing ";" or "--", which keeps this split safe.
const statements = schema
  .replace(/--[^\n]*/g, "")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean)

const sql = neon(url)
try {
  for (const statement of statements) await sql.query(statement)
  console.log(`Schema applied (${statements.length} statements).`)
} catch (error) {
  console.error("Migration failed:", error.message)
  process.exit(1)
}
