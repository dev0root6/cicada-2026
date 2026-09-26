import { Section } from "@/components/common/section"
import { sponsors } from "@/data/site"

export function Sponsors() {
  return (
    <Section size="wide" align="center" eyebrow="Backed by" title="Our proud partners">
      <ul className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
        {sponsors.map((sponsor) => (
          <li key={sponsor.name}>
            <a
              href={sponsor.href}
              target="_blank"
              rel="noreferrer noopener"
              className="block opacity-70 transition-opacity duration-300 hover:opacity-100"
            >
              {sponsor.logo ? (
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  loading="lazy"
                  className={`${sponsor.width ?? "w-40 md:w-48"} h-auto max-h-16 object-contain`}
                />
              ) : (
                <span className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  {sponsor.name}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  )
}
