import { Section } from "@/components/common/section"
import { PhotoMarquee } from "@/components/visuals/photo-marquee"
import { galleryImages } from "@/data/site"

export function Gallery() {
  return (
    <Section
      size="wide"
      align="center"
      eyebrow="On the ground"
      title="Event gallery"
      description="Moments from the floor — builds, demos, and the teams behind them."
      className="border-y border-border bg-card/30"
    >
      <PhotoMarquee images={galleryImages} />
    </Section>
  )
}
