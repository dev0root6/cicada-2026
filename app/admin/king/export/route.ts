import { NextResponse, type NextRequest } from "next/server"
import { getActor } from "@/lib/auth/actor"
import { isDatabaseConfigured } from "@/lib/db/client"
import {
  listRegistrations,
  PAYMENT_STATUSES,
  type PaymentStatus,
} from "@/lib/db/registrations"

export const dynamic = "force-dynamic"

/** Escapes a value for CSV: quote it and double any embedded quotes. */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return ""
  const text = typeof value === "object" ? JSON.stringify(value) : String(value)
  // A leading =, +, - or @ is treated as a formula by spreadsheet apps; prefix
  // with an apostrophe so exported data cannot execute on open.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text
  return `"${safe.replace(/"/g, '""')}"`
}

export async function GET(request: NextRequest) {
  // 404, not 401: an unauthenticated caller should not learn this route exists.
  const actor = await getActor()
  if (!actor) return new NextResponse("Not Found", { status: 404 })

  if (!isDatabaseConfigured()) {
    return new NextResponse("No database configured; there is nothing to export.", { status: 503 })
  }

  const params = request.nextUrl.searchParams
  const status = params.get("status")

  let registrations
  try {
    registrations = await listRegistrations({
      eventSlug: params.get("event") ?? undefined,
      status: PAYMENT_STATUSES.includes(status as PaymentStatus)
        ? (status as PaymentStatus)
        : undefined,
      search: params.get("q") ?? undefined,
      limit: 2000,
      // A manager exports only their own events.
      eventScope: actor.eventScope,
    })
  } catch (error) {
    console.error("csv export failed", error)
    return new NextResponse("Could not read registrations. Has the schema been applied?", {
      status: 500,
    })
  }

  const headerRow = [
    "id",
    "registered_at",
    "event",
    "team",
    "contact",
    "email",
    "phone",
    "amount_inr",
    "status",
    "cashfree_order_id",
    "cashfree_payment_id",
    "checked_in_at",
    "notes",
    "fields",
  ]

  const lines = [
    headerRow.join(","),
    ...registrations.map((r) =>
      [
        r.id,
        r.createdAt,
        r.eventSlug,
        r.teamName,
        r.contactName,
        r.email,
        r.phone,
        (r.amountPaise / 100).toFixed(2),
        r.paymentStatus,
        r.cashfreeOrderId,
        r.cashfreePaymentId,
        r.checkedInAt,
        r.notes,
        r.fields,
      ]
        .map(csvCell)
        .join(","),
    ),
  ]

  const stamp = new Date().toISOString().slice(0, 10)
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="registrations-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
