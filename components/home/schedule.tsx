import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/common/section"
import { schedule } from "@/data/schedule"
import { site } from "@/data/site"

export function Schedule() {
  return (
    <Section
      id="schedule"
      size="wide"
      eyebrow={site.dates}
      title="Schedule"
      description="Three days, one campus. Here's what runs when."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {schedule.map((day) => (
          <div key={day.label} className="surface overflow-hidden">
            <div className="flex items-baseline justify-between border-b border-border bg-gradient-to-br from-primary/10 to-transparent px-5 py-4">
              <h3 className="font-display text-xl font-semibold">{day.label}</h3>
              <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                {day.date}
              </p>
            </div>
            <ul className="divide-y divide-border">
              {day.items.map((item) => (
                <li key={item.title} className="px-5 py-3.5">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {item.time}
                  </p>
                  {item.slug ? (
                    <Link
                      href={`/events/${item.slug}`}
                      className="mt-1 inline-flex items-center gap-1 font-medium transition-colors hover:text-primary"
                    >
                      {item.title}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </Link>
                  ) : (
                    <p className="mt-1 font-medium">{item.title}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
