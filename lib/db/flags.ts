import "server-only"
import { getSql, isDatabaseConfigured } from "./client"

export const HELLOWORLD_CLAIMED = "helloworld_claimed"

export async function getFlag(key: string): Promise<string | null> {
  const sql = getSql()
  const rows = await sql`select value from site_flags where key = ${key}`
  return rows.length ? String(rows[0].value) : null
}

export async function setFlag(key: string, value: string, by: string): Promise<void> {
  const sql = getSql()
  await sql`
    insert into site_flags (key, value, updated_by, updated_at)
    values (${key}, ${value}, ${by}, now())
    on conflict (key) do update
      set value = excluded.value, updated_by = excluded.updated_by, updated_at = now()
  `
}

/**
 * Whether someone has already reported finding /helloworld. Any failure (no
 * database, table not created yet) reads as "not claimed", so the page keeps
 * working before the database is set up.
 */
export async function isHelloworldClaimed(): Promise<boolean> {
  if (!isDatabaseConfigured()) return false
  try {
    return (await getFlag(HELLOWORLD_CLAIMED)) === "yes"
  } catch {
    return false
  }
}
