import { Container } from "@/components/common/container"
import { Marquee } from "@/components/common/marquee"
import { announcement } from "@/data/site"

/**
 * Site-wide notice, above the navbar on every page.
 *
 * Deliberately loud: a postponement is the one thing every visitor needs to
 * leave with, so it gets display type, a hazard bar and a scrolling ticker
 * rather than a line of small text people scroll past. Amber throughout, so it
 * reads as news instead of another green accent.
 *
 * Not dismissible — hiding it behind an × is how people miss it.
 */
export function AnnouncementBanner() {
  if (!announcement.enabled) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className="relative z-50 overflow-hidden border-b border-amber-500/40 bg-gradient-to-b from-amber-500/[0.14] to-amber-500/[0.05]"
    >
      {/* Moving hazard stripes along the top edge. */}
      <div className="hazard-bar h-1.5 w-full opacity-70" aria-hidden />

      <Container size="wide">
        <div className="flex flex-col items-center gap-3 py-7 text-center md:py-9">
          <span className="flex items-center gap-2.5">
            <span
              className="animate-beacon h-2 w-2 rounded-full bg-amber-400"
              aria-hidden
            />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-amber-400/90">
              Important notice
            </span>
          </span>

          <h2 className="announce-glow max-w-4xl font-display text-2xl font-bold leading-[1.15] tracking-tight text-amber-200 sm:text-3xl md:text-4xl lg:text-5xl">
            {announcement.title}
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-amber-100/70 md:text-base">
            {announcement.body}
          </p>
        </div>
      </Container>

      {/* Ticker: the message keeps moving even once the block is scrolled past. */}
      <div className="border-t border-amber-500/25 bg-amber-500/[0.07] py-2">
        <Marquee duration={28} gapClassName="gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="flex shrink-0 items-center gap-8 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-amber-300/70"
            >
              {announcement.ticker}
              <span className="text-amber-500/50" aria-hidden>
                ◆
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </aside>
  )
}
