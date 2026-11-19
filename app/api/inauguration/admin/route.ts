import { NextResponse, type NextRequest } from "next/server"
import { checkAdminKey } from "@/lib/inauguration/auth"
import { ADMIN_HEADER } from "@/lib/inauguration/shared"
import { clearGuests, createGuests, getCeremony, resetPresses } from "@/lib/db/inauguration"

export const dynamic = "force-dynamic"

const MAX_GUESTS = 20

/**
 * Admin actions for the ceremony: create the guest codes, clear the presses
 * for a rehearsal, or wipe the list entirely.
 */
export async function POST(request: NextRequest) {
  if (!checkAdminKey(request.headers.get(ADMIN_HEADER))) {
    return NextResponse.json({ error: "Wrong passcode" }, { status: 401 })
  }

  let body: { action?: unknown; count?: unknown; labels?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 })
  }

  try {
    switch (body.action) {
      case "create": {
        const count = Number(body.count)
        if (!Number.isInteger(count) || count < 1 || count > MAX_GUESTS) {
          return NextResponse.json(
            { error: `Guest count must be a whole number between 1 and ${MAX_GUESTS}` },
            { status: 400 },
          )
        }
        const labels = Array.isArray(body.labels) ? body.labels.map((l) => String(l)) : []
        const guests = await createGuests(count, labels)
        return NextResponse.json({ guests, state: await getCeremony() })
      }
      case "reset":
        return NextResponse.json({ state: await resetPresses() })
      case "clear":
        return NextResponse.json({ state: await clearGuests() })
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (error) {
    // Almost always "tables not created yet" — say so rather than a bare 500.
    return NextResponse.json(
      {
        error:
          error instanceof Error && /relation|does not exist/i.test(error.message)
            ? "The ceremony tables are missing. Run the schema from the admin console first."
            : "The ceremony could not be updated. Check the database connection.",
      },
      { status: 500 },
    )
  }
}
