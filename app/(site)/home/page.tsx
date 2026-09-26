import { Hero } from "@/components/home/hero"
import { FeaturedEvents } from "@/components/home/featured-events"
import { Schedule } from "@/components/home/schedule"
import { AboutPreview } from "@/components/home/about-preview"
import { Standings } from "@/components/home/standings"
import { Gallery } from "@/components/home/gallery"
import { Sponsors } from "@/components/home/sponsors"
import { Venue } from "@/components/home/venue"
import { Faq } from "@/components/home/faq"
import { Cta } from "@/components/home/cta"
import { events } from "@/data/events"

export default function HomePage() {
  return (
    <>
      <Hero eventCount={events.length} />
      <FeaturedEvents />
      <Schedule />
      <AboutPreview />
      <Standings />
      <Gallery />
      <Sponsors />
      <Venue />
      <Faq />
      <Cta />
    </>
  )
}
