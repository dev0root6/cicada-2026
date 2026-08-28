export type StandingTeam = {
  rank: number
  teamName: string
  college: string
  participants?: string[]
}

export type StandingsCategory = {
  id: string
  label: string
  teams: StandingTeam[]
}

/** Project Expo results, grouped by track. */
export const projectExpoCategories: StandingsCategory[] = [
  {
    id: "hardware",
    label: "Hardware",
    teams: [
      {
        rank: 1,
        teamName: "Team Titans",
        college: "HKBK College of Engineering",
        participants: ["Ankita K", "Chandana L", "Chethan N", "Likitha M"],
      },
      {
        rank: 2,
        teamName: "Cambridge Scavengers",
        college: "Cambridge Institute of Technology",
        participants: ["Dikshitha Ramesh", "G Akshaya", "A Mohith", "Nagarjun Reddy"],
      },
    ],
  },
  {
    id: "software",
    label: "Software",
    teams: [
      {
        rank: 1,
        teamName: "Security Squads",
        college: "GEC Ramangara",
        participants: ["Nagashree M", "Mounika S C", "Manoj N", "Mahesh"],
      },
      {
        rank: 2,
        teamName: "Team 5 CSDS",
        college: "Atria Institute of Technology",
        participants: ["Sumanth", "Siddharth", "Umesh"],
      },
    ],
  },
]

/** Overall Project Expo leaderboard shown on the dedicated page. */
export const projectExpoWinners: StandingTeam[] = [
  {
    rank: 1,
    teamName: "Team InnovateX",
    college: "HKBK College of Engineering",
    participants: ["Ankita K", "Chandana L", "Chethan N", "Likitha M"],
  },
  { rank: 2, teamName: "Tech Pioneers", college: "Atria Institute of Technology" },
  { rank: 3, teamName: "CodeCrafters", college: "Atria Institute of Technology" },
  { rank: 4, teamName: "ByteMasters", college: "Atria Institute of Technology" },
]
