import Link from "next/link"
import { ArrowRight, BookOpenText, CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EventCover } from "@/components/events/event-cover"
import { registrationHref, type Event } from "@/data/events"

/**
 * Uniform event tile. Every per-event variation now comes from the data
 * (`badges`, `clubLogo`, `brochureImage`) instead of slug comparisons, so the
 * card stays the same height and layout for every event.
 */
export function EventCard({ event }: { event: Event }) {
  return (
    <article className="surface surface-hover group flex h-full flex-col overflow-hidden">
      <Link
        href={`/events/${event.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-muted"
      >
        <EventCover
          event={{ ...event, imageFit: "cover" }}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent"
          aria-hidden
        />
        {event.badges && event.badges.length > 0 && (
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {event.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-primary/30 bg-background/80 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-primary backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          {event.clubLogo && (
            <img
              src={event.clubLogo}
              alt=""
              aria-hidden
              loading="lazy"
              className="h-6 w-6 rounded-full border border-border object-cover"
            />
          )}
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
            {event.clubName.replace(/\s+/g, " ").trim()}
          </span>
        </div>

        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/events/${event.slug}`} className="transition-colors hover:text-primary">
            {event.title.trim()}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {event.summary}
        </p>

        <dl className="mt-4 space-y-1.5 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
            <dt className="sr-only">Date</dt>
            <dd>
              {event.date?.trim() ?? "Date TBA"} · {(event.time ?? event.Duration).trim()}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
            <dt className="sr-only">Venue</dt>
            <dd className="truncate">{event.venue}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/events/${event.slug}`}>
              Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          {event.registrationsClosed ? (
            <span className="rounded-full border border-amber-500/50 bg-amber-500/10 px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-amber-300">
              Closed
            </span>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href={registrationHref(event)}>Register</Link>
            </Button>
          )}
          {event.brochureImage && (
            <Button asChild size="icon" variant="ghost" title={`${event.title} brochure`}>
              <a href={event.brochureImage} target="_blank" rel="noreferrer noopener">
                <BookOpenText className="h-4 w-4" />
                <span className="sr-only">View brochure</span>
              </a>
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
