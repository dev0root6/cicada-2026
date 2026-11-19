import type { Metadata } from "next"

import { getCeremony } from "@/lib/db/inauguration"
import { Dashboard } from "./dashboard"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Inauguration — CICADA 2026",
  robots: { index: false, follow: false },
}

/** The projector screen. Blank until every chief guest has pressed. */
export default async function DashboardPage() {
  const state = await getCeremony()
  return <Dashboard initial={state} />
}
