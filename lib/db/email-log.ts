import "server-only"
import { getSql } from "./client"

export type EmailLogEntry = {
  kind: string
  recipient: string
  eventSlug?: string | null
  note?: string | null
  sentBy: string
}

export async function logEmails(entries: EmailLogEntry[]): Promise<void> {
  if (!entries.length) return
  const sql = getSql()
  await sql`
    insert into email_log (kind, recipient, event_slug, note, sent_by)
    select * from unnest(
      ${entries.map((e) => e.kind)}::text[],
      ${entries.map((e) => e.recipient)}::text[],
      ${entries.map((e) => e.eventSlug ?? null)}::text[],
      ${entries.map((e) => e.note ?? null)}::text[],
      ${entries.map((e) => e.sentBy)}::text[]
    )
  `
}

/** Lowercased recipients who got `kind` within the last `hours`. */
export async function recentlySent(kind: string, hours: number): Promise<Set<string>> {
  const sql = getSql()
  const rows = await sql`
    select distinct lower(recipient) as r
      from email_log
     where kind = ${kind}
       and sent_at > now() - make_interval(hours => ${hours})
  `
  return new Set(rows.map((row) => String(row.r)))
}

export type SentSummary = { kind: string; recipient: string; sentBy: string; sentAt: string }

export async function recentEmails(limit = 15): Promise<SentSummary[]> {
  const sql = getSql()
  const rows = await sql`
    select kind, recipient, sent_by, sent_at from email_log order by sent_at desc limit ${limit}
  `
  return rows.map((row) => ({
    kind: String(row.kind),
    recipient: String(row.recipient),
    sentBy: String(row.sent_by ?? ""),
    sentAt: new Date(String(row.sent_at)).toISOString(),
  }))
}
