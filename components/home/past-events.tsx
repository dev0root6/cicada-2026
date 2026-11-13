import { Section } from "@/components/common/section"
import { editionTotals, pastEditions, type PastEvent } from "@/data/past-events"
import { site } from "@/data/site"

/**
 * The archive: what each previous edition actually drew and who won.
 *
 * Deliberately quiet — muted imagery, no buttons — so a finished event is
 * never mistaken for one still open to register for.
 */
export function PastEvents() {
  return (
    <Section
      id="past-editions"
      size="wide"
      eyebrow="The story so far"
      title="Previous editions"
      description="What CICADA has run before, and who took it home. This year's line-up is above."
    >
      <div className="space-y-14">
        {pastEditions.map((edition) => {
          const totals = editionTotals(edition)

          return (
            <div key={edition.year}>
              <div className="mb-6 border-b border-border pb-5">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="font-display text-2xl font-semibold">
                    CICADA {edition.year}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                    {edition.dates}
                  </p>
                </div>
                <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
                  Organised by the {edition.departments} departments at {site.venue.name}.
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
                  <Stat label="Participants" value={totals.participants.toLocaleString("en-IN")} />
                  <Stat label="Teams" value={String(totals.teams)} />
                  <Stat label="Colleges" value={edition.colleges} />
                  <Stat label="Events" value={String(totals.events)} />
                </dl>
              </div>

              <ul className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {edition.events.map((event) => (
                  <EventCard key={event.title} event={event} />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card p-4">
      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  )
}

function EventCard({ event }: { event: PastEvent }) {
  const credit = [event.host, event.sponsor && `sponsored by ${event.sponsor}`]
    .filter(Boolean)
    .join(" · ")

  return (
    <li className="surface group overflow-hidden">
      {/* The bug sits behind the photo, so a cover that ever stops resolving
          leaves a branded panel rather than a void. */}
      <div
        className="relative aspect-[16/10] overflow-hidden bg-muted bg-[length:38%] bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/brand/cicada-bug.svg)" }}
      >
        {event.image && (
          <img
            src={event.image}
            alt=""
            aria-hidden
            loading="lazy"
            className="h-full w-full object-cover opacity-55 grayscale transition duration-500 group-hover:opacity-80 group-hover:grayscale-0"
          />
        )}
        <span
          className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent"
          aria-hidden
        />
      </div>

      <div className="p-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
          {event.date}
          {credit && ` · ${credit}`}
        </p>
        <h4 className="mt-2 text-base font-semibold leading-snug">{event.title}</h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.summary}</p>

        <p className="mt-3 font-mono text-xs text-muted-foreground">
          <span className="text-foreground">{event.participants.total}</span> participants
          <span className="text-muted-foreground/60">
            {" "}
            ({event.participants.inHouse} in-house, {event.participants.external} external)
          </span>{" "}
          · <span className="text-foreground">{event.teams}</span> teams
        </p>

        {event.note && (
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{event.note}</p>
        )}

        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {event.winners.map((winner, index) => (
            <li key={index} className="flex items-baseline gap-2.5 text-sm">
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                {winner.place}
              </span>
              <span className="min-w-0 flex-1">
                {winner.track && (
                  <span className="mr-1.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">
                    {winner.track}
                  </span>
                )}
                <span className="text-foreground">{winner.college}</span>
                {winner.teamName && (
                  <span className="text-muted-foreground"> — {winner.teamName}</span>
                )}
              </span>
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {winner.prize}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
