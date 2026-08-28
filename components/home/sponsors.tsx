import { Section } from "@/components/common/section"
import { Marquee } from "@/components/common/marquee"
import { sponsors } from "@/data/site"

export function Sponsors() {
  return (
    <Section size="wide" align="center" eyebrow="Backed by" title="Our proud partners">
      <Marquee duration={45}>
        {sponsors.map((sponsor) => (
          <img
            key={sponsor.name}
            src={sponsor.logo}
            alt={sponsor.name}
            loading="lazy"
            className={`${sponsor.width} h-auto max-h-16 shrink-0 object-contain opacity-70 transition-opacity duration-300 hover:opacity-100`}
          />
        ))}
      </Marquee>
    </Section>
  )
}
