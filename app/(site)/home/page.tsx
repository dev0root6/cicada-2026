import { Hero } from "@/components/home/hero"
import { FeaturedEvents } from "@/components/home/featured-events"
import { Schedule } from "@/components/home/schedule"
import { AboutPreview } from "@/components/home/about-preview"
import { Gallery } from "@/components/home/gallery"
import { PastEvents } from "@/components/home/past-events"
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
      <Gallery />
      <PastEvents />
      <Sponsors />
      <Venue />
      <Faq />
      <Cta />
    </>
  )
}
