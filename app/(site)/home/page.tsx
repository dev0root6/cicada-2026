// import { AnnouncementBanner } from "@/components/layout/announcement-banner"
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
import { countEvents } from "@/data/events"

export default function HomePage() {
  return (
    <>
      {/*
        Hackathon updates notice (HACKATHON UPDATES heading + 24-hour run
        sheet). Taken off the site for now; uncomment this and the import
        above to bring it back. The component and its data in `data/site.ts`
        (`announcement`, `hackathonRunSheet`) are left in place.
      */}
      {/* <AnnouncementBanner /> */}
      <Hero eventCount={countEvents()} />
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
