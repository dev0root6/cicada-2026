import { NextResponse } from "next/server"
import { getCeremony } from "@/lib/db/inauguration"

/** Polled by the dashboard and the guest pages. Never cached. */
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  const state = await getCeremony()
  return NextResponse.json(state, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  })
}
