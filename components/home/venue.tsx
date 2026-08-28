import { ExternalLink, MapPin } from "lucide-react"
import { Section } from "@/components/common/section"
import { site } from "@/data/site"

export function Venue() {
  return (
    <Section
      size="wide"
      eyebrow="Getting there"
      title="Venue"
      description="Tap the map for directions."
    >
      <div className="grid items-center gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="flex items-start gap-2 text-lg font-medium">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
            <span>
              {site.venue.name}
              <span className="block text-base font-normal text-muted-foreground">
                {site.venue.city}
              </span>
            </span>
          </p>
          <a
            href={site.venue.mapUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-primary transition-opacity hover:opacity-80"
          >
            Open in Google Maps
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </div>

        <a
          href={site.venue.mapUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="surface group block overflow-hidden lg:col-span-8"
        >
          <img
            src={site.venue.mapImage}
            alt={`Map showing ${site.venue.name}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </a>
      </div>
    </Section>
  )
}
