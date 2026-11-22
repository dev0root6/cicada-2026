import { Trophy } from "lucide-react"

import { results, resultsPublished } from "@/data/results"
import { cn } from "@/lib/utils"

/** Gold, silver, bronze — in that order, whatever the list length. */
const placeTone = [
  "border-amber-400/45 bg-amber-400/[0.07] text-amber-200",
  "border-zinc-300/35 bg-zinc-300/[0.06] text-zinc-200",
  "border-orange-500/35 bg-orange-500/[0.06] text-orange-200",
]

/** The winners of one event. Renders nothing until results are published. */
export function EventResults({ slug }: { slug: string }) {
  if (!resultsPublished) return null
  const placements = results[slug]
  if (!placements?.length) return null

  return (
    <div className="surface p-6">
      <h2 className="flex items-center gap-2.5 text-base font-semibold">
        <Trophy className="h-4 w-4 text-primary" aria-hidden />
        Winners
      </h2>

      <ol className="mt-5 space-y-3">
        {placements.map((placement, index) => (
          <li
            key={`${placement.place}-${placement.team}`}
            className={cn(
              "flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border p-4",
              placeTone[index] ?? "border-border bg-background/40 text-foreground",
            )}
          >
            <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.18em]">
              {placement.place}
            </span>
            <span className="text-base font-semibold text-foreground">{placement.team}</span>
            {placement.tag && (
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] opacity-80">
                {placement.tag}
              </span>
            )}
            <span className="w-full text-sm text-muted-foreground">{placement.college}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
