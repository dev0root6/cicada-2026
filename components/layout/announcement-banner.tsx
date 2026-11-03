import { Megaphone } from "lucide-react"
import { Container } from "@/components/common/container"
import { announcement } from "@/data/site"

/**
 * Site-wide notice above the navbar.
 *
 * Amber rather than the usual green: this is news that changes someone's plans,
 * and it should not read as just another accent on the page. Deliberately not
 * dismissible — it is the most important thing the site has to say right now,
 * and it is one line.
 */
export function AnnouncementBanner() {
  if (!announcement.enabled) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className="relative z-50 border-b border-amber-500/30 bg-amber-500/10 backdrop-blur-sm"
    >
      <Container size="wide">
        <div className="flex items-start gap-3 py-2.5 text-sm sm:items-center">
          <Megaphone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400 sm:mt-0" aria-hidden />
          <p className="flex flex-col gap-x-2 gap-y-0.5 sm:flex-row sm:items-center">
            <span className="font-medium text-amber-200">{announcement.title}</span>
            <span className="text-amber-200/70">{announcement.body}</span>
          </p>
        </div>
      </Container>
    </aside>
  )
}
