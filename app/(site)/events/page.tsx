import type { Metadata } from "next"
import { Section } from "@/components/common/section"
import { EventCard } from "@/components/events/event-card"
import { events, eventsByDay } from "@/data/events"

export const metadata: Metadata = {
  title: "Events",
  description: "Browse every CICADA event and register.",
}

export default function EventsPage() {
  const days = eventsByDay()

  return (
    <Section
      size="wide"
      eyebrow={`${events.length} events · ${days.length} days`}
      title="All events"
      description="Hackathons, CTFs, agent builds, drone runs and showcases, in running order. Pick a track and register — most events run in teams."
    >
      <div className="space-y-14">
        {days.map((day) => (
          <section key={day.date} aria-labelledby={`day-${day.label}`}>
            <div className="mb-6 flex items-baseline gap-4 border-b border-border pb-3">
              <h2
                id={`day-${day.label}`}
                className="font-mono text-lg font-semibold uppercase tracking-[0.12em]"
              >
                {day.label}
              </h2>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                {day.date.replace(/,\s*\d{4}$/, "")}
              </p>
              <p className="ml-auto font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {day.events.length} {day.events.length === 1 ? "event" : "events"}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {day.events.map((event) => (
                <EventCard key={event.slug} event={event} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Section>
  )
}
