import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/common/container"
import { ParticleNetwork } from "@/components/visuals/particle-network"
import { site } from "@/data/site"

/**
 * Full-bleed hero: particle canvas, then a hairline grid, then the copy.
 * The layout is a single asymmetric grid rather than the old 50/50 split, so
 * the headline gets the room and the logo reads as a watermark.
 */
export function Hero({ eventCount }: { eventCount: number }) {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <ParticleNetwork className="absolute inset-0 -z-20" showControls={false} />
      <div className="grid-backdrop absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/60 to-background"
        aria-hidden
      />

      <Container size="wide">
        <div className="grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12">
          <div className="animate-rise-in lg:col-span-7">
            <p className="eyebrow">Atria Institute of Technology presents</p>

            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
              {site.name}{" "}
              <span className="text-primary">{site.edition}</span>
              <span className="mt-2 block text-3xl font-medium text-muted-foreground md:text-4xl">
                The annual tech fest
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Workshops, hackathons, competitions, tech talks and creative showcases across every
              club on campus. Come build, learn and connect.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/events">
                  Explore events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={site.brochure} target="_blank" rel="noreferrer noopener">
                  Download brochure
                </a>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
              <Stat label="Events" value={String(eventCount)} />
              <Stat label="Dates" value={site.shortDates} icon={CalendarDays} />
              <Stat label="Venue" value="Hebbal" icon={MapPin} />
            </dl>
          </div>

          <div className="hidden justify-center lg:col-span-5 lg:flex">
            <img
              src={site.logo}
              alt=""
              aria-hidden
              className="w-full max-w-sm object-contain opacity-90 drop-shadow-[0_0_60px_oklch(0.72_0.19_142/0.25)]"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string
  icon?: typeof CalendarDays
}) {
  return (
    <div className="bg-background/60 p-4 backdrop-blur-sm">
      <dt className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" aria-hidden />}
        {label}
      </dt>
      <dd className="mt-1 font-display text-xl font-semibold tabular-nums">{value}</dd>
    </div>
  )
}
