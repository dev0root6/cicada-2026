import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { BellRing } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/common/container"
import { NotifyForm } from "@/components/events/notify-form"
import { events } from "@/data/events"

type PageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = events.find((e) => e.slug === slug)
  if (!event) return {}
  return { title: `Register — ${event.title.trim()}` }
}

export default async function RegisterPage({ params }: PageProps) {
  const { slug } = await params
  const event = events.find((e) => e.slug === slug)
  if (!event) notFound()
  // Once a real form is linked, this page is only a detour.
  if (event.registerUrl) redirect(event.registerUrl)

  return (
    <Container size="narrow">
      <div className="py-16 md:py-24">
        <div className="surface p-6 md:p-10">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
            <BellRing className="h-5 w-5 text-primary" aria-hidden />
          </span>

          <p className="eyebrow mt-6">{event.title.trim()}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            Registration opens soon
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Registrations for this event aren't open yet. Enter your email to get a priority
            notification the moment they open.
          </p>

          <div className="mt-8">
            <NotifyForm eventSlug={event.slug} />
          </div>
        </div>

        <Button asChild variant="ghost" size="sm" className="mt-6">
          <Link href={`/events/${event.slug}`}>← Back to event details</Link>
        </Button>
      </div>
    </Container>
  )
}
