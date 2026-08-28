import { NextResponse, type NextRequest } from "next/server"
import { toPaymentStatus, verifyWebhookSignature, isCashfreeConfigured } from "@/lib/payments/cashfree"
import { updatePaymentStatus } from "@/lib/db/registrations"

export const dynamic = "force-dynamic"

/**
 * Cashfree payment webhook.
 *
 * Payment status is only ever changed here, never from the browser redirect —
 * a client-side "payment succeeded" callback is trivially forged. This endpoint
 * is unauthenticated by necessity, so the HMAC signature is the only thing
 * standing between an attacker and marking their own registration paid.
 */
export async function POST(request: NextRequest) {
  if (!isCashfreeConfigured()) {
    return NextResponse.json({ error: "Cashfree is not configured" }, { status: 503 })
  }

  // The raw bytes must be hashed; re-serialising parsed JSON breaks the signature.
  const rawBody = await request.text()

  const valid = await verifyWebhookSignature({
    rawBody,
    signature: request.headers.get("x-webhook-signature"),
    timestamp: request.headers.get("x-webhook-timestamp"),
  })

  if (!valid) {
    // Deliberately terse: do not tell a forger which part failed.
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  let event: {
    type?: string
    data?: {
      order?: { order_id?: string }
      payment?: { payment_status?: string; cf_payment_id?: string | number }
    }
  }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 })
  }

  const orderId = event.data?.order?.order_id
  if (!orderId) {
    // 200 so Cashfree does not retry a payload we will never be able to use.
    return NextResponse.json({ ignored: true })
  }

  const status = toPaymentStatus(event.data?.payment?.payment_status)
  const paymentId = event.data?.payment?.cf_payment_id

  try {
    await updatePaymentStatus({
      cashfreeOrderId: orderId,
      status,
      cashfreePaymentId: paymentId != null ? String(paymentId) : null,
    })
  } catch (error) {
    console.error("cashfree webhook: failed to persist", error)
    // 500 asks Cashfree to retry, rather than silently dropping a real payment.
    return NextResponse.json({ error: "Storage failure" }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
