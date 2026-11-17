import { Container } from "@/components/common/container"
import { Marquee } from "@/components/common/marquee"
import { announcement, hackathonRunSheet } from "@/data/site"

/**
 * The fest's headline notice, rendered at the top of the home page.
 *
 * Deliberately loud: this is the one thing every visitor should leave with, so
 * it gets display type and movement rather than a line of small text people
 * scroll past. Green rather than a warning colour — it is news, not a caution.
 *
 * Not dismissible: hiding it behind an × is how people miss it.
 *
 * It currently carries the hackathon run sheet, because the schedule is the
 * thing entrants come back to check. The dates themselves are the hero's job.
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
        <div className="flex flex-col items-center gap-4 pt-9 text-center md:pt-12">
          <span className="flex items-center gap-2.5">
            <span className="animate-beacon h-2 w-2 rounded-full bg-primary" aria-hidden />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-primary">
              {hackathonRunSheet.kicker}
            </span>
          </span>

          <h2 className="announce-glow font-display text-3xl font-bold uppercase leading-[1.08] tracking-[0.04em] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Hackathon updates
          </h2>

          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            {hackathonRunSheet.lead}
          </p>
        </div>

        {hackathonRunSheet.enabled && (
          <div className="mx-auto mb-10 mt-8 max-w-5xl rounded-xl border border-primary/30 bg-background/50 p-6 md:mb-12 md:mt-10 md:p-8">
            <h3 className="text-center font-mono text-[0.7rem] uppercase tracking-[0.3em] text-primary">
              {hackathonRunSheet.title}
            </h3>

            <ol className="mt-6 grid gap-x-8 gap-y-0 sm:grid-cols-2">
              {hackathonRunSheet.items.map((item) => (
                <li
                  key={`${item.time}-${item.label}`}
                  className="flex items-baseline gap-4 border-b border-border py-3 last:border-b-0 sm:last:border-b sm:[&:nth-last-child(-n+2)]:border-b-0"
                >
                  <span
                    className={
                      item.key
                        ? "w-[8.5rem] shrink-0 font-mono text-[0.78rem] font-semibold tabular-nums tracking-tight text-primary"
                        : "w-[8.5rem] shrink-0 font-mono text-[0.78rem] tabular-nums tracking-tight text-muted-foreground"
                    }
                  >
                    {item.time}
                  </span>
                  <span
                    className={
                      item.key
                        ? "min-w-0 text-sm font-semibold text-foreground"
                        : "min-w-0 text-sm text-foreground/90"
                    }
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
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
