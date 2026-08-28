import Link from "next/link"
import { Building2, Cpu, Medal, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/common/section"
import { projectExpoCategories, type StandingTeam } from "@/data/standings"

const categoryIcons = { hardware: Cpu, software: Trophy } as const

/**
 * Project Expo results by track. Previously four near-identical inline blocks
 * built from `[1, 2].map` + ternaries; now one component over `data/standings`.
 */
export function Standings() {
  return (
    <Section
      id="standings"
      align="center"
      eyebrow="Results"
      title="Project Expo standings"
      description="Celebrating excellence in innovation across both tracks."
    >
      <div className="grid gap-8 md:grid-cols-2">
        {projectExpoCategories.map((category) => {
          const Icon = categoryIcons[category.id as keyof typeof categoryIcons] ?? Trophy

          return (
            <div key={category.id}>
              <h3 className="flex items-center justify-center gap-2 text-lg font-semibold">
                <Icon className="h-4 w-4 text-primary" aria-hidden />
                {category.label}
              </h3>
              <div className="mt-5 space-y-4">
                {category.teams.map((team) => (
                  <TeamCard key={`${category.id}-${team.rank}`} team={team} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-12 text-center">
        <Button asChild variant="outline">
          <Link href="/project-expo">Full leaderboard</Link>
        </Button>
      </div>
    </Section>
  )
}

function TeamCard({ team }: { team: StandingTeam }) {
  const isWinner = team.rank === 1
  const Icon = isWinner ? Trophy : Medal

  return (
    <article className="surface surface-hover p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
            {isWinner ? "1st place" : "2nd place"}
          </p>
          <h4 className="mt-1.5 text-lg font-semibold text-primary">{team.teamName}</h4>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {team.college}
          </p>
        </div>
        <Icon
          className={isWinner ? "h-7 w-7 shrink-0 text-amber-400" : "h-7 w-7 shrink-0 text-slate-400"}
          aria-hidden
        />
      </header>

      {team.participants && team.participants.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
            Team members
          </p>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {team.participants.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
