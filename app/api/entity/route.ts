import { NextResponse } from "next/server"
import { getEntityState } from "@/lib/db/flags"

export const dynamic = "force-dynamic"

/** Polled by open /entity pages so they flip the moment someone wins. Never says who. */
export async function GET() {
  const { destroyed, at } = await getEntityState()
  return NextResponse.json(
    { destroyed, at },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } },
  )
}
