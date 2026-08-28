import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/common/section"
import { pillars, site } from "@/data/site"

export function AboutPreview() {
  return (
    <Section id="about" size="wide" eyebrow="The fest" title={`About ${site.name}`}>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="surface flex flex-col justify-between p-8 lg:col-span-5">
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              {site.title} is AIT&apos;s flagship tech fest — three days of hands-on workshops,
              competitions, talks and creative showcases led by student clubs. It&apos;s where ideas
              turn into prototypes and teams into communities.
            </p>
            <p className="leading-relaxed">
              Whether you&apos;re building your first bot, shipping an AI app, or solving CTF
              challenges, {site.name} is designed for makers at every level.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-8 self-start">
            <Link href="/about">
              More about us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
          {pillars.map((pillar, index) => (
            <div key={pillar.title} className="surface surface-hover p-6">
              <p className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-base font-semibold">{pillar.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{pillar.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
