import type { ReactNode } from "react"
import { AnnouncementBanner } from "@/components/layout/announcement-banner"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeistBackdrop } from "@/components/visuals/heist-backdrop"
import { SiteEffects } from "@/components/visuals/site-effects"

/**
 * Chrome for every public page. Previously each page imported and rendered
 * <Navbar /> and <Footer /> itself.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeistBackdrop />
      <SiteEffects />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AnnouncementBanner />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
