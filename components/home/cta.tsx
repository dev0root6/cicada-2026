import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/common/container"
import { site } from "@/data/site"

export function Cta() {
  return (
    <section className="py-16 md:py-24">
      <Container size="wide">
        <div className="surface relative overflow-hidden px-8 py-14 text-center md:px-16 md:py-20">
          <div className="grid-backdrop absolute inset-0 opacity-30" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent"
            aria-hidden
          />
          <div className="relative">
            <p className="eyebrow">{site.dates}</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
              Bring an idea. Leave with a prototype.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Registrations are open across every track. Solo or in a team — beginners welcome.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/events">
                  Browse events
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={site.brochure} target="_blank" rel="noreferrer noopener">
                  Read the brochure
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
