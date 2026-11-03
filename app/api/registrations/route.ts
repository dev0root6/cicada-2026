import { NextResponse, type NextRequest } from "next/server"
import { createRegistration } from "@/lib/db/registrations"
import { createOrder, isCashfreeConfigured } from "@/lib/payments/cashfree"
import { events } from "@/data/events"
import { site } from "@/data/site"

export const dynamic = "force-dynamic"

/** Registration fee strings in data/events.ts look like "₹ 1200 per team". */
function feeToPaise(fee: string): number {
  const digits = fee.replace(/[^\d.]/g, "")
  const rupees = Number.parseFloat(digits)
  return Number.isFinite(rupees) ? Math.round(rupees * 100) : 0
}

type Body = {
  eventSlug?: string
  teamName?: string
  contactName?: string
  email?: string
  phone?: string
  fields?: Record<string, unknown>
}

/**
 * Public registration intake: records the entry, then opens a Cashfree order.
 *
 * The amount is taken from data/events.ts on the server — never from the
 * request — so a caller cannot choose their own price.
 */
export async function POST(request: NextRequest) {
  let body: Body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Malformed request body" }, { status: 400 })
  }

  const event = events.find((e) => e.slug === body.eventSlug)
  if (!event) return NextResponse.json({ error: "Unknown event" }, { status: 404 })

  const contactName = body.contactName?.trim()
  const email = body.email?.trim().toLowerCase()
  const phone = body.phone?.trim()

  if (!contactName || !email || !phone) {
    return NextResponse.json(
      { error: "contactName, email and phone are required" },
      { status: 400 },
    )
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
  }
  if (!/^\+?[\d\s-]{8,15}$/.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
  }

  if (!isCashfreeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured" }, { status: 503 })
  }

  const amountPaise = feeToPaise(event.registrationFee)
  // Fees still "Yet to be announced" would otherwise become a ₹0 order.
  if (amountPaise <= 0) {
    return NextResponse.json({ error: "Registration fee not announced yet" }, { status: 409 })
  }
  const orderId = `cicada-${event.slug}-${crypto.randomUUID()}`

  try {
    // Persist first: a registration with no order is recoverable, whereas a
    // paid order with no registration is not.
    await createRegistration({
      eventSlug: event.slug,
      teamName: body.teamName?.trim() || null,
      contactName,
      email,
      phone,
      fields: body.fields ?? {},
      amountPaise,
      cashfreeOrderId: orderId,
    })

    const order = await createOrder({
      orderId,
      amountPaise,
      customer: { id: orderId, name: contactName, email, phone },
      returnUrl: `${request.nextUrl.origin}/events/${event.slug}?order={order_id}`,
      note: `${site.title} — ${event.title.trim()}`,
    })

    return NextResponse.json({ orderId, paymentSessionId: order.paymentSessionId })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed"
    // Unique index violation on (event_slug, email).
    if (message.includes("registrations_event_email_idx")) {
      return NextResponse.json(
        { error: "This email is already registered for this event." },
        { status: 409 },
      )
    }
    console.error("registration failed", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
