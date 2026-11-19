import "server-only"
import type { CeremonyState, Guest } from "@/lib/inauguration/shared"
import { getSql, isDatabaseConfigured } from "./client"

/**
 * The inauguration ceremony.
 *
 * One ceremony (`CEREMONY_ID`) with one row per chief guest. A guest's row id
 * is the code in their link — /in/<id> — so holding the link is what lets you
 * press that guest's button.
 *
 * Release is derived rather than stored: the ceremony is released once every
 * guest row has a `pressed_at`. Two guests pressing at the same instant, a
 * double tap, or a refresh therefore cannot release it twice or leave it in a
 * half-released state.
 */

export const CEREMONY_ID = "live"

export type { CeremonyState, Guest }

const EMPTY: CeremonyState = {
  ready: false,
  guestCount: 0,
  pressedCount: 0,
  released: false,
  releasedAt: null,
  guests: [],
}

/** Unambiguous in handwriting and over a phone call: no 0/O, 1/I/L. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"

function code(length = 6): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let out = ""
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length]
  return out
}

function iso(value: unknown): string | null {
  if (!value) return null
  return value instanceof Date ? value.toISOString() : String(value)
}

function toGuest(row: Record<string, unknown>): Guest {
  return {
    id: String(row.id),
    label: String(row.label),
    position: Number(row.position),
    pressedAt: iso(row.pressed_at),
  }
}

async function ensureCeremony(): Promise<void> {
  const sql = getSql()
  await sql`
    insert into inauguration_ceremony (id) values (${CEREMONY_ID})
    on conflict (id) do nothing
  `
}

/**
 * The whole ceremony in one read. Any failure — no database, tables not
 * created yet — comes back as "not ready" rather than throwing, so the pages
 * render an explanation instead of an error screen.
 */
export async function getCeremony(): Promise<CeremonyState> {
  if (!isDatabaseConfigured()) return EMPTY
  try {
    const sql = getSql()
    const ceremony = await sql`
      select guest_count, released_at from inauguration_ceremony where id = ${CEREMONY_ID}
    `
    const rows = await sql`
      select id, label, position, pressed_at
        from inauguration_guests
       where ceremony_id = ${CEREMONY_ID}
       order by position
    `
    const guests = rows.map(toGuest)
    const pressedCount = guests.filter((guest) => guest.pressedAt).length
    const guestCount = ceremony.length ? Number(ceremony[0].guest_count) : 0

    return {
      ready: true,
      guestCount,
      pressedCount,
      // Guard on guests.length: zero guests must not read as "everyone pressed".
      released: guests.length > 0 && pressedCount === guests.length,
      releasedAt: ceremony.length ? iso(ceremony[0].released_at) : null,
      guests,
    }
  } catch {
    return EMPTY
  }
}

/** One guest, for their own page. Null when the code is not a real guest. */
export async function getGuest(id: string): Promise<Guest | null> {
  if (!isDatabaseConfigured()) return null
  try {
    const sql = getSql()
    const rows = await sql`
      select id, label, position, pressed_at
        from inauguration_guests
       where id = ${id} and ceremony_id = ${CEREMONY_ID}
    `
    return rows.length ? toGuest(rows[0]) : null
  } catch {
    return null
  }
}

/**
 * Replaces the guest list with `count` freshly generated codes.
 *
 * Deliberately destructive: the admin sets the number of guests in the room,
 * and old codes from a rehearsal must stop working. Returns the new guests.
 */
export async function createGuests(count: number, labels: string[] = []): Promise<Guest[]> {
  const sql = getSql()
  await ensureCeremony()

  await sql`delete from inauguration_guests where ceremony_id = ${CEREMONY_ID}`
  await sql`
    update inauguration_ceremony
       set guest_count = ${count}, released_at = null, updated_at = now()
     where id = ${CEREMONY_ID}
  `

  const ids: string[] = []
  const names: string[] = []
  const positions: number[] = []
  for (let i = 0; i < count; i++) {
    ids.push(code())
    names.push(labels[i]?.trim() || `Chief Guest ${i + 1}`)
    positions.push(i + 1)
  }

  if (count > 0) {
    await sql`
      insert into inauguration_guests (id, ceremony_id, label, position)
      select * from unnest(
        ${ids}::text[],
        ${Array(count).fill(CEREMONY_ID)}::text[],
        ${names}::text[],
        ${positions}::int[]
      )
    `
  }

  const rows = await sql`
    select id, label, position, pressed_at
      from inauguration_guests
     where ceremony_id = ${CEREMONY_ID}
     order by position
  `
  return rows.map(toGuest)
}

/**
 * Records a guest's press. Idempotent: the `pressed_at is null` guard means a
 * second press is a no-op rather than moving the timestamp, so a guest who
 * taps twice doesn't rewrite the record of when they actually pressed.
 *
 * Stamps the ceremony's released_at in the same call once the last guest is
 * in, so the dashboard has a release time to show.
 */
export async function pressGuest(id: string): Promise<CeremonyState> {
  const sql = getSql()
  await sql`
    update inauguration_guests
       set pressed_at = now()
     where id = ${id} and ceremony_id = ${CEREMONY_ID} and pressed_at is null
  `
  await sql`
    update inauguration_ceremony
       set released_at = now(), updated_at = now()
     where id = ${CEREMONY_ID}
       and released_at is null
       and exists (select 1 from inauguration_guests where ceremony_id = ${CEREMONY_ID})
       and not exists (
             select 1 from inauguration_guests
              where ceremony_id = ${CEREMONY_ID} and pressed_at is null
           )
  `
  return getCeremony()
}

/** Clears every press and the release, keeping the same guest codes. */
export async function resetPresses(): Promise<CeremonyState> {
  const sql = getSql()
  await ensureCeremony()
  await sql`
    update inauguration_guests set pressed_at = null where ceremony_id = ${CEREMONY_ID}
  `
  await sql`
    update inauguration_ceremony set released_at = null, updated_at = now() where id = ${CEREMONY_ID}
  `
  return getCeremony()
}

/** Removes every guest, leaving the ceremony empty. */
export async function clearGuests(): Promise<CeremonyState> {
  const sql = getSql()
  await ensureCeremony()
  await sql`delete from inauguration_guests where ceremony_id = ${CEREMONY_ID}`
  await sql`
    update inauguration_ceremony
       set guest_count = 0, released_at = null, updated_at = now()
     where id = ${CEREMONY_ID}
  `
  return getCeremony()
}
