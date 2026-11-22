import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { events } from "@/data/events"
import { results, resultsPublished } from "@/data/results"
import { cn } from "@/lib/utils"

/**
 * The winners' board: every event's placements on one screen.
 *
 * Appears only once results are published (data/results.ts), so the component
 * can sit in the home page the whole time without showing an empty shell.
 */

const placeTone = [
  "text-amber-300",
  "text-zinc-300",
  "text-orange-300",
]

export function Winners() {
  if (!resultsPublished) return null

  const boards = events
    .map((event) => ({ event, placements: results[event.slug] ?? [] }))
    .filter((board) => board.placements.length > 0)

  if (boards.length === 0) return null

  const total = boards.reduce((count, board) => count + board.placements.length, 0)

  return (
    <Section
      id="winners"
      size="wide"
      eyebrow={`${total} teams on the board`}
      title="Winners — CICADA 2026"
      description="Across four events and three days. Congratulations to every team that placed, and thank you to everyone who turned up and built."
      className="border-y border-border bg-primary/[0.02]"
      action={
        <Button asChild variant="outline">
          <Link href="/events">
            Event details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {boards.map(({ event, placements }) => (
          <article key={event.slug} className="surface flex flex-col p-5">
            <h3 className="text-base font-semibold leading-snug">
              <Link href={`/events/${event.slug}`} className="hover:text-primary">
                {event.title.trim()}
              </Link>
            </h3>

            <ol className="mt-4 space-y-3.5">
              {placements.map((placement, index) => (
                <li key={`${placement.place}-${placement.team}`} className="flex gap-3">
                  <span
                    className={cn(
                      "w-8 shrink-0 font-mono text-[0.72rem] font-bold uppercase tracking-[0.1em]",
                      placeTone[index] ?? "text-muted-foreground",
                    )}
                  >
                    {placement.place}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      {placement.team}
                    </span>
                    <span className="block text-xs leading-snug text-muted-foreground">
                      {placement.college}
                    </span>
                    {placement.tag && (
                      <span className="mt-1 block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-primary/80">
                        {placement.tag}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </Section>
  )
}
