import type { Metadata } from "next"
import { Section } from "@/components/common/section"
import { projectExpoWinners, type StandingTeam } from "@/data/standings"

export const metadata: Metadata = {
  title: "Project Expo Standings",
  description: "The winning teams of the CICADA Project Expo.",
}

const placements = ["Champion", "Runner-Up", "3rd Place", "4th Place"]

export default function ProjectExpoPage() {
  return (
    <Section
      size="wide"
      align="center"
      eyebrow="Leaderboard"
      title="Project Expo standings"
      description="Meet the winning teams."
    >
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {projectExpoWinners.map((team) => (
          <WinnerCard key={team.rank} team={team} />
        ))}
      </ol>
    </Section>
  )
}

function WinnerCard({ team }: { team: StandingTeam }) {
  const isChampion = team.rank === 1

  return (
    <li
      className={
        isChampion
          ? "surface surface-hover flex flex-col p-6 ring-1 ring-primary/40"
          : "surface surface-hover flex flex-col p-6"
      }
    >
      <div className="flex items-baseline justify-between">
        <span className="font-display text-5xl font-bold tabular-nums text-primary/30">
          {team.rank}
        </span>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          {placements[team.rank - 1]}
        </span>
      </div>

      <h2 className="mt-4 text-lg font-semibold">{team.teamName}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{team.college}</p>

      {team.participants && team.participants.length > 0 && (
        <div className="mt-6 border-t border-border pt-4">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
            Team members
          </p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {team.participants.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </li>
  )
}
