import type { Metadata } from "next"
import { Section } from "@/components/common/section"
import { EventCard } from "@/components/events/event-card"
import { events } from "@/data/events"

export const metadata: Metadata = {
  title: "Events",
  description: "Browse every CICADA event and register.",
}

export default function EventsPage() {
  return (
    <Section
      size="wide"
      eyebrow={`${events.length} events`}
      title="All events"
      description="Hackathons, CTFs, ideathons and showcases. Pick a track and register — most events run in teams."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </Section>
  )
}
