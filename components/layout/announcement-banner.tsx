import { Container } from "@/components/common/container"
import { Marquee } from "@/components/common/marquee"
import { announcement } from "@/data/site"

/**
 * Site-wide notice, above the navbar on every page.
 *
 * Deliberately loud: this is the one thing every visitor should leave with, so
 * it gets display type and movement rather than a line of small text people
 * scroll past. Green rather than a warning colour — it is a teaser, not a
 * caution.
 *
 * Not dismissible: hiding it behind an × is how people miss it.
 */
export function AnnouncementBanner() {
  if (!announcement.enabled) return null

  return (
    <aside
      role="status"
      aria-live="polite"
      className="relative z-50 overflow-hidden border-b border-primary/30 bg-gradient-to-b from-primary/[0.12] to-primary/[0.03]"
    >
      {/* Light sweeping along the top edge. */}
      <div className="signal-bar h-[3px] w-full" aria-hidden />

      <Container size="wide">
        <div className="flex flex-col items-center gap-4 py-8 text-center md:py-11">
          <span className="flex items-center gap-2.5">
            <span className="animate-beacon h-2 w-2 rounded-full bg-primary" aria-hidden />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-primary">
              {announcement.kicker}
            </span>
          </span>

          <h2 className="announce-glow max-w-4xl font-display text-3xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            {announcement.title}
          </h2>

          <div className="max-w-2xl space-y-1.5">
            {announcement.lines.map((line) => (
              <p key={line} className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {line}
              </p>
            ))}
          </div>

          {announcement.highlight && (
            <p className="mt-1 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-2 text-sm font-medium text-foreground">
              <span aria-hidden>{announcement.highlight.icon}</span>
              {announcement.highlight.text}
            </p>
          )}

          <ul className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-1.5">
            {announcement.hashtags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-primary/25 px-3 py-1 font-mono text-[0.65rem] tracking-wider text-primary/80"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* Ticker: the message keeps moving once the block is scrolled past. */}
      <div className="border-t border-primary/20 bg-primary/[0.05] py-2">
        <Marquee duration={28} gapClassName="gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="flex shrink-0 items-center gap-8 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-primary/70"
            >
              {announcement.ticker}
              <span className="text-primary/40" aria-hidden>
                ◆
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </aside>
  )
}
