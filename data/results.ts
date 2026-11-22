/**
 * CICADA 2026 results.
 *
 * Team names and colleges exactly as the organisers recorded them. Where a
 * team carried a number on the day it is kept in `tag`, so a result can be
 * matched back to the register.
 *
 * Keyed by event slug (see data/events.ts) so the event pages and the home
 * page read from the same place.
 */

export type Placement = {
  /** "1st", "2nd", "3rd". */
  place: string
  team: string
  college: string
  /** The team's number on the day, or the franchise it represented. */
  tag?: string
}

export const results: Record<string, Placement[]> = {
  "project-expo": [
    { place: "1st", team: "Quantum Pioneers", college: "Cambridge Institute of Technology" },
    { place: "2nd", team: "GAT", college: "Global Academy of Technology" },
    { place: "3rd", team: "Notarc", college: "Sri Krishna Institute of Technology" },
  ],
  "ipl-auction": [
    {
      place: "1st",
      team: "Thunder Titans",
      college: "Atria Institute of Technology",
      tag: "Mumbai Indians",
    },
    {
      place: "2nd",
      team: "REVA Gladiators",
      college: "REVA University",
      tag: "Lucknow Super Giants",
    },
  ],
  hackathon: [
    { place: "1st", team: "Team Astra", college: "Christ University", tag: "Team 40" },
    { place: "2nd", team: "Team Turing Machine", college: "Atria Institute of Technology", tag: "Team 22" },
    { place: "3rd", team: "Team Cicadians", college: "RNS Institute of Technology", tag: "Team 43" },
  ],
  "free-fire": [
    { place: "1st", team: "Doctor Esports", college: "RV University" },
    {
      place: "2nd",
      team: "Team Prime",
      college: "Sheshadripuram First Grade College, Yelahanka",
    },
  ],
}

/** Whether results have been published for an event. */
export function hasResults(slug: string): boolean {
  return (results[slug]?.length ?? 0) > 0
}

/** Master switch — turns the winners board on across the site. */
export const resultsPublished = true
