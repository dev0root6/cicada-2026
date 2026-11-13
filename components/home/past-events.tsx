import { Section } from "@/components/common/section"
import { pastEditions } from "@/data/past-events"

/**
 * The archive. These events are over, so the cards are deliberately quiet —
 * no buttons, no links, muted imagery — and must not read as something still
 * open to register for.
 */
export function PastEvents() {
  return (
    <Section
      id="past-editions"
      size="wide"
      eyebrow="The story so far"
      title="Previous editions"
      description="What CICADA has run before. These events have finished — this year's line-up is above."
    >
      <div className="space-y-12">
        {pastEditions.map((edition) => (
          <div key={edition.year}>
            <div className="mb-6 flex items-baseline gap-4 border-b border-border pb-3">
              <h3 className="font-display text-2xl font-semibold">CICADA {edition.year}</h3>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {edition.dates}
              </p>
              <p className="ml-auto font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {edition.events.length} events
              </p>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {edition.events.map((event) => (
                <li key={event.title} className="surface group overflow-hidden">
                  {/* The bug sits behind the photo, so a poster that ever stops
                      resolving leaves a branded panel rather than a void. */}
                  <div
                    className="relative aspect-[16/10] overflow-hidden bg-muted bg-[length:38%] bg-center bg-no-repeat opacity-100"
                    style={{ backgroundImage: "url(/brand/cicada-bug.svg)" }}
                  >
                    <img
                      src={event.image}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="h-full w-full object-cover opacity-55 grayscale transition duration-500 group-hover:opacity-80 group-hover:grayscale-0"
                    />
                    <span
                      className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent"
                      aria-hidden
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                      {event.clubName} · {event.date}
                    </p>
                    <h4 className="mt-2 text-base font-semibold leading-snug">{event.title}</h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {event.summary}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
