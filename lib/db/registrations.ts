import "server-only"
import { getSql, runRawSql, type Row } from "./client"
import type { EventSummary, PaymentStatus, Registration } from "./types"

export * from "./types"

/**
 * The single boundary where untyped database rows become typed domain objects.
 * Casts are concentrated here rather than scattered across the query functions.
 */
function toRegistration(row: Row): Registration {
  return {
    id: Number(row.id),
    eventSlug: String(row.event_slug),
    teamName: (row.team_name as string | null) ?? null,
    contactName: String(row.contact_name),
    email: String(row.email),
    phone: String(row.phone),
    fields: (row.fields as Record<string, unknown> | null) ?? {},
    amountPaise: Number(row.amount_paise),
    currency: String(row.currency),
    paymentStatus: row.payment_status as PaymentStatus,
    cashfreeOrderId: (row.cashfree_order_id as string | null) ?? null,
    cashfreePaymentId: (row.cashfree_payment_id as string | null) ?? null,
    createdAt: new Date(row.created_at as string).toISOString(),
    updatedAt: new Date(row.updated_at as string).toISOString(),
  }
}

/**
 * Every query below uses tagged-template interpolation, which the Neon driver
 * sends as bound parameters — values are never concatenated into SQL text.
 */

export async function listRegistrations(options: {
  eventSlug?: string
  status?: PaymentStatus
  search?: string
  limit?: number
}): Promise<Registration[]> {
  const sql = getSql()
  const limit = Math.min(Math.max(options.limit ?? 500, 1), 2000)

  // `is null or` lets one prepared statement cover every filter combination.
  const search = options.search?.trim() ? `%${options.search.trim()}%` : null

  const rows = await sql`
    select *
      from registrations
     where (${options.eventSlug ?? null}::text is null or event_slug = ${options.eventSlug ?? null})
       and (${options.status ?? null}::text is null or payment_status = ${options.status ?? null})
       and (
         ${search}::text is null
         or contact_name ilike ${search}
         or email        ilike ${search}
         or phone        ilike ${search}
         or team_name    ilike ${search}
       )
     order by created_at desc
     limit ${limit}
  `
  return rows.map(toRegistration)
}

export async function summariseByEvent(): Promise<EventSummary[]> {
  const sql = getSql()
  const rows = await sql`
    select event_slug,
           count(*)                                                          as total,
           count(*) filter (where payment_status = 'paid')                   as paid,
           count(*) filter (where payment_status = 'pending')                as pending,
           count(*) filter (where payment_status = 'failed')                 as failed,
           coalesce(sum(amount_paise) filter (where payment_status = 'paid'), 0) as collected_paise
      from registrations
     group by event_slug
     order by count(*) desc
  `
  return rows.map((row) => ({
    eventSlug: String(row.event_slug),
    total: Number(row.total),
    paid: Number(row.paid),
    pending: Number(row.pending),
    failed: Number(row.failed),
    collectedPaise: Number(row.collected_paise),
  }))
}

export async function createRegistration(input: {
  eventSlug: string
  teamName?: string | null
  contactName: string
  email: string
  phone: string
  fields?: Record<string, unknown>
  amountPaise: number
  cashfreeOrderId: string
}): Promise<Registration> {
  const sql = getSql()
  const rows = await sql`
    insert into registrations
      (event_slug, team_name, contact_name, email, phone, fields, amount_paise, cashfree_order_id)
    values
      (${input.eventSlug}, ${input.teamName ?? null}, ${input.contactName}, ${input.email},
       ${input.phone}, ${JSON.stringify(input.fields ?? {})}::jsonb, ${input.amountPaise},
       ${input.cashfreeOrderId})
    returning *
  `
  return toRegistration(rows[0])
}

/**
 * Called by the Cashfree webhook. Terminal states are not walked back — a late
 * duplicate webhook must not turn a paid registration back into pending.
 */
export async function updatePaymentStatus(input: {
  cashfreeOrderId: string
  status: PaymentStatus
  cashfreePaymentId?: string | null
}): Promise<Registration | null> {
  const sql = getSql()
  const rows = await sql`
    update registrations
       set payment_status      = ${input.status},
           cashfree_payment_id = coalesce(${input.cashfreePaymentId ?? null}, cashfree_payment_id),
           updated_at          = now()
     where cashfree_order_id = ${input.cashfreeOrderId}
       and payment_status not in ('paid', 'refunded')
    returning *
  `
  return rows.length ? toRegistration(rows[0]) : null
}

/** Idempotent; safe to run on every deploy. */
export async function ensureSchema(schemaSql: string): Promise<void> {
  await runRawSql(schemaSql)
}
