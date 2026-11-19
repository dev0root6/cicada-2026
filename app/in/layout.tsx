import type { Metadata } from "next"
import type { ReactNode } from "react"

/**
 * The inauguration area.
 *
 * Outside the (site) route group on purpose: these screens go on a projector
 * and on guests' phones during the ceremony, so they get the whole viewport
 * with no site header, footer or navigation to tap by accident.
 */
export const metadata: Metadata = {
  title: "CICADA 2026 — Inauguration",
  robots: { index: false, follow: false },
}

export default function InaugurationLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-dvh bg-background text-foreground">{children}</div>
}
