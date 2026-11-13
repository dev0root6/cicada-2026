import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/common/section"
import { EventCard } from "@/components/events/event-card"
import { countEvents, events } from "@/data/events"

export function FeaturedEvents() {
  return (
    <Section
      id="featured"
      size="wide"
      eyebrow={`${countEvents()} events`}
      title="The line-up"
      description="Everything running across the three days. Every event is on campus and open to teams from any college."
      action={
        <Button asChild variant="outline">
          <Link href="/events">
            All events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </Section>
  )
}
