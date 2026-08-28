/**
 * Shared registration types and constants.
 *
 * Deliberately free of `server-only` and of any driver import, so client
 * components (filters, badges, tables) can use them without pulling the
 * database client into the browser bundle.
 */

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
  "cancelled",
] as const

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export type Registration = {
  id: number
  eventSlug: string
  teamName: string | null
  contactName: string
  email: string
  phone: string
  fields: Record<string, unknown>
  amountPaise: number
  currency: string
  paymentStatus: PaymentStatus
  cashfreeOrderId: string | null
  cashfreePaymentId: string | null
  checkedInAt: string | null
  checkedInBy: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type EventSummary = {
  eventSlug: string
  total: number
  paid: number
  pending: number
  failed: number
  checkedIn: number
  collectedPaise: number
}
