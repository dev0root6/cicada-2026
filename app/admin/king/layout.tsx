import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  // Keep the admin surface out of search results entirely.
  robots: { index: false, follow: false, nocache: true },
}

/**
 * The admin area deliberately does not use the public (site) chrome — no public
 * navbar, no footer, no marketing links.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>
}
