import { NextResponse, type NextRequest } from "next/server"
import { getGuest, pressGuest } from "@/lib/db/inauguration"

export const dynamic = "force-dynamic"

/**
 * A chief guest pressing their button.
 *
 * The guest's code is the only credential — whoever holds the link may press
 * that one button. Pressing is idempotent, so a double tap or a retry after a
 * flaky connection is harmless.
 */
export async function POST(request: NextRequest) {
  let id: unknown
  try {
    ;({ id } = await request.json())
  } catch {
    return NextResponse.json({ error: "Expected JSON body" }, { status: 400 })
  }

  if (typeof id !== "string" || !id.trim()) {
    return NextResponse.json({ error: "Missing guest id" }, { status: 400 })
  }

  const guest = await getGuest(id)
  if (!guest) {
    return NextResponse.json({ error: "Unknown guest code" }, { status: 404 })
  }

  const state = await pressGuest(id)
  return NextResponse.json(
    { guest: { ...guest, pressedAt: guest.pressedAt ?? new Date().toISOString() }, state },
    { headers: { "Cache-Control": "no-store" } },
  )
}
