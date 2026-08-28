import "server-only"
import { timingSafeEqual } from "@/lib/auth/crypto"
import type { PaymentStatus } from "@/lib/db/types"

/**
 * Cashfree Payment Gateway (PG v3, 2023-08-01).
 * Docs: https://www.cashfree.com/docs/api-reference/payments/latest
 *
 * NOT YET EXERCISED AGAINST LIVE CASHFREE — no merchant credentials were
 * available. Run one sandbox order end-to-end before taking real payments.
 */

const API_VERSION = "2023-08-01"

function baseUrl(): string {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg"
}

export function isCashfreeConfigured(): boolean {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY)
}

function credentials() {
  const appId = process.env.CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY
  if (!appId || !secretKey) {
    throw new Error("CASHFREE_APP_ID and CASHFREE_SECRET_KEY must be set")
  }
  return { appId, secretKey }
}

export type CreateOrderInput = {
  orderId: string
  amountPaise: number
  customer: { id: string; name: string; email: string; phone: string }
  returnUrl: string
  note?: string
}

export type CreateOrderResult = {
  paymentSessionId: string
  orderId: string
}

/**
 * Creates an order and returns the session id the browser checkout needs.
 * Amount is converted from paise at the boundary — Cashfree bills in rupees.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const { appId, secretKey } = credentials()

  const response = await fetch(`${baseUrl()}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": API_VERSION,
      "x-client-id": appId,
      "x-client-secret": secretKey,
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: Number((input.amountPaise / 100).toFixed(2)),
      order_currency: "INR",
      order_note: input.note,
      customer_details: {
        customer_id: input.customer.id,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone,
      },
      order_meta: { return_url: input.returnUrl },
    }),
    cache: "no-store",
  })

  const payload = (await response.json()) as {
    payment_session_id?: string
    order_id?: string
    message?: string
  }

  if (!response.ok || !payload.payment_session_id) {
    throw new Error(`Cashfree order failed (${response.status}): ${payload.message ?? "unknown"}`)
  }

  return { paymentSessionId: payload.payment_session_id, orderId: payload.order_id ?? input.orderId }
}

/**
 * Verifies a webhook is genuinely from Cashfree.
 *
 * Cashfree signs `timestamp + rawBody` with the merchant secret (HMAC-SHA256,
 * base64). The RAW request body must be passed — re-serialising parsed JSON
 * changes the bytes and the signature will not match.
 */
export async function verifyWebhookSignature(input: {
  rawBody: string
  signature: string | null
  timestamp: string | null
}): Promise<boolean> {
  if (!input.signature || !input.timestamp) return false

  const { secretKey } = credentials()
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${input.timestamp}${input.rawBody}`),
  )

  let binary = ""
  for (const byte of new Uint8Array(mac)) binary += String.fromCharCode(byte)
  return timingSafeEqual(btoa(binary), input.signature)
}

/** Maps Cashfree payment states onto our own. */
export function toPaymentStatus(cashfreeStatus: string | undefined): PaymentStatus {
  switch (cashfreeStatus) {
    case "SUCCESS":
      return "paid"
    case "FAILED":
    case "USER_DROPPED":
      return "failed"
    case "CANCELLED":
      return "cancelled"
    default:
      return "pending"
  }
}
