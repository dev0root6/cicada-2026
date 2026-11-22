import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CalendarDays, Clock, MapPin, Users, Wifi } from "lucide-react"
import { Container } from "@/components/common/container"
import { InfoPill } from "@/components/common/info-pill"
import { EventCover } from "@/components/events/event-cover"
import { EventDescription } from "@/components/events/event-description"
import { EventNotice } from "@/components/events/event-notice"
import { EventResults } from "@/components/events/event-results"
import { EventSidebar } from "@/components/events/event-sidebar"
import { EventRequirements, EventTakeaways } from "@/components/events/event-takeaways"
import { PrizePanel } from "@/components/events/prize-panel"
import { DEFAULT_PRIZES, events } from "@/data/events"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = events.find((e) => e.slug === slug)
  if (!event) return {}

  return {
    title: event.title.trim(),
    description: event.summary,
    openGraph: {
      title: event.title.trim(),
      description: event.summary,
      images: event.coverImage ? [event.coverImage] : undefined,
    },
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = events.find((e) => e.slug === slug)
  if (!event) notFound()

  const pills = [
    { icon: CalendarDays, label: event.date?.trim() ?? "Date to be announced" },
    { icon: Clock, label: event.Duration.trim() },
    { icon: Users, label: event.teamSize },
    ...(event.mode ? [{ icon: Wifi, label: event.mode }] : []),
    { icon: MapPin, label: event.venue },
  ]

  return (
    <>
      {/* Banner image bleeds full width; the title card overlaps it below. */}
      <div className="relative h-56 w-full overflow-hidden border-b border-border md:h-72">
        <EventCover event={event} />
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20"
          aria-hidden
        />
      </div>

      <Container size="wide">
        <div className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
          <div className="space-y-8 lg:col-span-8">
            <header>
              <div className="flex items-center gap-2">
                {event.clubLogo && (
                  <img
                    src={event.clubLogo}
                    alt=""
                    aria-hidden
                    className="h-7 w-7 rounded-full border border-border object-cover"
                  />
                )}
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground">
                  {event.clubName.replace(/\s+/g, " ").trim()}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
                {event.title.trim()}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {event.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {pills.map((pill) => (
                  <InfoPill key={pill.label} icon={pill.icon} label={pill.label} />
                ))}
              </div>
            </header>

            {event.notice && <EventNotice notice={event.notice} />}

            <section className="border-t border-border pt-8">
              <h2 className="text-xl font-semibold">About this event</h2>
              <div className="mt-5">
                <EventDescription description={event.description} />
              </div>
            </section>

            <EventResults slug={event.slug} />

            <PrizePanel
              prizes={event.prizes?.length ? event.prizes : DEFAULT_PRIZES}
              participantReward={event.participantReward}
            />

            <EventTakeaways slug={event.slug} />
            <EventRequirements />
          </div>

          <aside className="lg:col-span-4">
            <EventSidebar event={event} />
          </aside>
        </div>
      </Container>
    </>
  )
}
