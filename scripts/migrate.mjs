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

try {
  await neon(url).query(schema)
  console.log("Schema applied.")
} catch (error) {
  console.error("Migration failed:", error.message)
  process.exit(1)
}
