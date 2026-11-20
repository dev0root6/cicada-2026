import type { Metadata } from "next"

import { LandingShow } from "./show"

export const metadata: Metadata = {
  title: "CICADA 2026",
  description: "CICADA 2026 — the annual tech fest of Atria Institute of Technology.",
}

/**
 * The standing display: the mark, and a cicada flying across it.
 *
 * Built to be left running on a screen — a foyer monitor, a stall laptop, a
 * projector between sessions. Nothing to click and nothing that ends.
 */
export default function LandingPage() {
  return <LandingShow />
}
