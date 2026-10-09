import { Award, Trophy } from "lucide-react"
import { PRIZE_TBA, type EventPrize } from "@/data/events"

type PrizePanelProps = {
  prizes: EventPrize[]
  participantReward?: string
}

export function PrizePanel({ prizes, participantReward }: PrizePanelProps) {
  return (
    <div className="surface overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-6 py-4">
        <Trophy className="h-4 w-4 text-primary" aria-hidden />
        <h2 className="text-base font-semibold">What&apos;s in it for you</h2>
      </div>

      <div className={prizes.length > 1 ? "grid gap-px bg-border sm:grid-cols-2" : "grid gap-px bg-border"}>
        {prizes.map((prize) => (
          <div key={prize.label} className="bg-card p-6">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              {prize.label}
            </p>
            {prize.amount === PRIZE_TBA ? (
              <p className="mt-2 font-display text-xl font-semibold uppercase tracking-[0.06em] text-primary">
                {prize.amount}
              </p>
            ) : (
              <>
                <p className="mt-2 font-display text-4xl font-bold tabular-nums">{prize.amount}</p>
                <p className="mt-1 text-xs text-muted-foreground">Cash prize</p>
              </>
            )}
            {prize.perks && prize.perks.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {prize.perks.map((perk) => (
                  <li
                    key={perk}
                    className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {perk}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {participantReward && (
        <div className="flex items-center gap-3 border-t border-border px-6 py-4">
          <Award className="h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <p className="text-sm font-medium">All participants</p>
            <p className="text-sm text-muted-foreground">{participantReward}</p>
          </div>
        </div>
      )}
    </div>
  )
}
