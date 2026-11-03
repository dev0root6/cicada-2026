import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContactDialog } from "@/components/common/contact-dialog"
import { organizerContacts, site } from "@/data/site"
import { registrationHref, type Event } from "@/data/events"

/** Sticky booking rail: fee, CTAs, the full fact sheet, and who to call. */
export function EventSidebar({ event }: { event: Event }) {
  const facts = [
    { label: "Date", value: event.date.trim() },
    ...(event.time ? [{ label: "Time", value: event.time }] : []),
    { label: "Duration", value: event.Duration.trim() },
    { label: "Team size", value: event.teamSize },
    ...(event.mode ? [{ label: "Mode", value: event.mode }] : []),
  ]

  return (
    <div className="lg:sticky lg:top-24">
      <div className="surface overflow-hidden">
        <div className="border-b border-border bg-gradient-to-br from-primary/10 to-transparent p-6">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            Registration fee
          </p>
          <p className="mt-2 font-display text-3xl font-bold">{event.registrationFee}</p>

          <Button asChild size="lg" className="mt-5 w-full">
            <Link href={registrationHref(event)}>Register now</Link>
          </Button>

          {event.brochureImage && (
            <Button asChild size="lg" variant="outline" className="mt-2 w-full">
              <a href={event.brochureImage} target="_blank" rel="noreferrer noopener">
                <ExternalLink className="h-4 w-4" />
                Event brochure
              </a>
            </Button>
          )}
        </div>

        <dl className="divide-y divide-border">
          {facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-4 px-6 py-3.5">
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="text-right text-sm font-medium">{fact.value}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 px-6 py-3.5">
            <dt className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
              Venue
            </dt>
            <dd className="text-right text-sm font-medium">
              <a
                href={site.venue.mapUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 transition-colors hover:text-primary"
              >
                {event.venue}
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="surface mt-4 p-5">
        <p className="text-sm text-muted-foreground">
          Questions about this event? Talk to the organising team.
        </p>
        <ContactDialog
          people={organizerContacts}
          trigger={
            <Button variant="outline" size="sm" className="mt-3 w-full">
              Contact organizers
            </Button>
          }
        />
      </div>

      <Button asChild variant="ghost" size="sm" className="mt-4 w-full">
        <Link href="/events">← All events</Link>
      </Button>
    </div>
  )
}
