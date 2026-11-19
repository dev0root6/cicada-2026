import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCeremony, getGuest } from "@/lib/db/inauguration"
import { GuestButton } from "./button"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Your button — CICADA 2026",
  robots: { index: false, follow: false },
}

/**
 * One chief guest's screen. The code in the URL is the credential: whoever
 * opens this link can press this guest's button, once.
 */
export default async function GuestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guest = await getGuest(id)
  if (!guest) notFound()

  const state = await getCeremony()
  return <GuestButton guest={guest} initial={state} />
}
