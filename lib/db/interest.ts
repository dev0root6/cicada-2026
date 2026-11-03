import "server-only"
import { getSql } from "./client"

/**
 * Records a request to be told when an event's registrations open. Repeat
 * sign-ups are a no-op. Returns true only for a new entry — callers use it to
 * avoid re-sending the confirmation, not to tell the visitor anything.
 */
export async function addRegistrationInterest(eventSlug: string, email: string): Promise<boolean> {
  const sql = getSql()
  const rows = await sql`
    insert into registration_interest (event_slug, email)
    values (${eventSlug}, ${email})
    on conflict (event_slug, lower(email)) do nothing
    returning id
  `
  return rows.length > 0
}

export type PendingInterest = { id: number; email: string }

/** Oldest first, so the earliest sign-ups hear first. */
export async function listPendingInterest(eventSlug: string, limit: number): Promise<PendingInterest[]> {
  const sql = getSql()
  const rows = await sql`
    select id, email
      from registration_interest
     where event_slug = ${eventSlug}
       and notified_at is null
     order by created_at
     limit ${limit}
  `
  return rows.map((row) => ({ id: Number(row.id), email: String(row.email) }))
}

export async function markInterestNotified(ids: number[]): Promise<void> {
  if (!ids.length) return
  const sql = getSql()
  await sql`update registration_interest set notified_at = now() where id = any(${ids}::bigint[])`
}

export type InterestSummary = { eventSlug: string; waiting: number; notified: number }

export async function summariseInterest(): Promise<InterestSummary[]> {
  const sql = getSql()
  const rows = await sql`
    select event_slug,
           count(*) filter (where notified_at is null)     as waiting,
           count(*) filter (where notified_at is not null) as notified
      from registration_interest
     group by event_slug
  `
  return rows.map((row) => ({
    eventSlug: String(row.event_slug),
    waiting: Number(row.waiting),
    notified: Number(row.notified),
  }))
}

export type PreRegistered = {
  email: string
  /** Event slugs this address asked to hear about. */
  events: string[]
}

/**
 * Everyone on a pre-registration ("notify me") list, one row per address.
 * Pass an event slug to limit it to that event's list.
 */
export async function listPreRegistered(eventSlug?: string | null): Promise<PreRegistered[]> {
  const sql = getSql()
  const rows = await sql`
    select lower(email) as email, array_agg(distinct event_slug) as events
      from registration_interest
     where (${eventSlug ?? null}::text is null or event_slug = ${eventSlug ?? null})
     group by lower(email)
     order by min(created_at)
  `
  return rows.map((row) => ({ email: String(row.email), events: (row.events as string[]) ?? [] }))
}

export async function isPreRegistered(email: string): Promise<boolean> {
  const sql = getSql()
  const rows = await sql`select 1 from registration_interest where lower(email) = lower(${email}) limit 1`
  return rows.length > 0
}
