import "server-only"
import { getSql, isDatabaseConfigured } from "./client"

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

/* -------------------------------------------------------------------------- */
/* The /entity/helloworld hunt                                                 */
/* -------------------------------------------------------------------------- */

/** "yes" once someone has pressed the emergency turn-off; updated_by holds their email. */
export const ENTITY_DESTROYED = "entity_destroyed"

export type EntityState = { destroyed: boolean; by: string | null; at: string | null }

/**
 * Whether the entity has been destroyed, and by whom. Any failure (no database,
 * table not created yet) reads as "still alive", so the hunt keeps working
 * before the database is set up.
 */
export async function getEntityState(): Promise<EntityState> {
  const alive: EntityState = { destroyed: false, by: null, at: null }
  if (!isDatabaseConfigured()) return alive
  try {
    const sql = getSql()
    const rows = await sql`select value, updated_by, updated_at from site_flags where key = ${ENTITY_DESTROYED}`
    if (!rows.length || rows[0].value !== "yes") return alive
    const at = rows[0].updated_at
    return {
      destroyed: true,
      by: rows[0].updated_by ? String(rows[0].updated_by) : null,
      at: at instanceof Date ? at.toISOString() : at ? String(at) : null,
    }
  } catch {
    return alive
  }
}

/**
 * Marks the entity destroyed by `email`, but only if nobody got there first.
 * One statement, so two people pressing the button at the same moment cannot
 * both win: the losing write matches no row and returns nothing.
 */
export async function destroyEntity(email: string): Promise<boolean> {
  const sql = getSql()
  const rows = await sql`
    insert into site_flags (key, value, updated_by, updated_at)
    values (${ENTITY_DESTROYED}, 'yes', ${email}, now())
    on conflict (key) do update
      set value = 'yes', updated_by = excluded.updated_by, updated_at = now()
      where site_flags.value <> 'yes'
    returning key
  `
  return rows.length > 0
}
