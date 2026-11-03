import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/common/container"
import { BUG_SRC, WORDMARK_SRC } from "@/components/brand/logo"
import { DATE_TBA_SHORT, site } from "@/data/site"

/**
 * Centred lockup echoing the teaser at "/": the bug glitches in, the wordmark
 * locks into place, then the copy rises. The ambient grid behind it comes from
 * the site layout's HeistBackdrop.
 */
export function Hero({ eventCount }: { eventCount: number }) {
  return (
    <section className="relative border-b border-border">
      <Container size="wide">
        <div className="flex flex-col items-center py-20 text-center md:py-28">
          {/* The flying bug (SiteEffects) takes off from here. */}
          <img
            src={BUG_SRC}
            alt=""
            aria-hidden
            data-cicada-home="hero"
            className="glow animate-glitch-in w-[clamp(140px,24vw,240px)]"
          />
          <h1 className="animate-lock mt-6 w-[clamp(260px,62vw,600px)]">
            <img
              src={WORDMARK_SRC}
              alt={site.title}
              className="w-full drop-shadow-[0_0_18px_rgb(76_217_123/0.22)]"
            />
          </h1>

          <div className="animate-rise-in [animation-delay:0.9s]">
            <p className="mt-4 font-mono text-xs tracking-[0.5em] text-primary">
              <span className="text-muted-foreground">[</span> {site.edition}{" "}
              <span className="text-muted-foreground">]</span>
            </p>

            <p className="eyebrow mt-8">Atria Institute of Technology presents</p>

            <p className="mx-auto mt-5 max-w-2xl font-mono text-sm uppercase tracking-[0.14em] text-foreground sm:text-base sm:tracking-[0.2em] md:text-lg">
              The plan is already in motion.
            </p>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Workshops, hackathons, competitions, tech talks and creative showcases across every
              club on campus. Pick your crew, pick your job.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

            <dl className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border text-left">
              <Stat label="Events" value={String(eventCount)} />
              <Stat label="Dates" value={site.shortDates ?? DATE_TBA_SHORT} icon={CalendarDays} />
              <Stat label="Venue" value="Hebbal" icon={MapPin} />
            </dl>
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
    <div className="bg-background/80 p-4">
      <dt className="flex items-center gap-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" aria-hidden />}
        {label}
      </dt>
      <dd className="mt-1 whitespace-nowrap font-mono text-base font-semibold tabular-nums text-primary sm:text-xl">{value}</dd>
    </div>
  )
}
