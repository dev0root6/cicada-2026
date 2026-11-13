/**
 * Previous editions, for the archive on the home page.
 *
 * Figures come from the CICADA 2K25 post-event report. Where the report left
 * something out — the Project Expo and Hackathon winners' team names — the
 * field is simply absent rather than filled in with a guess.
 */

export type PastWinner = {
  /** "1st", "2nd". */
  place: string
  college: string
  /** Absent where the report did not record one. */
  teamName?: string
  prize: string
  /** Project Expo ran Hardware and Software as separate tracks. */
  track?: string
}

export type PastEvent = {
  title: string
  summary: string
  /** The club that ran it, where one did. */
  host?: string
  sponsor?: string
  date: string
  participants: { total: number; inHouse: number; external: number }
  teams: number
  /** Anything else the report recorded, e.g. who inaugurated it. */
  note?: string
  winners: PastWinner[]
  image?: string
}

export type PastEdition = {
  /** Styled as the fest wrote it that year. */
  year: string
  dates: string
  /** Departments that organised it. */
  departments: string
  /** Kept as a string: the report says "more than 70". */
  colleges: string
  events: PastEvent[]
}

export const pastEditions: PastEdition[] = [
  {
    year: "2K25",
    dates: "5 – 8 November 2025",
    departments: "ISE, CSE-DS, ECE and MBA",
    colleges: "70+",
    events: [
      {
        title: "Project Expo",
        summary:
          "Hardware and software projects judged across two tracks by industry and academic panels.",
        date: "5 Nov 2025",
        note: "Inaugurated by Mr. Rakesh H. M., Senior Member of Technical Staff, Oracle",
        participants: { total: 241, inHouse: 102, external: 139 },
        teams: 60,
        winners: [
          { place: "1st", track: "Hardware", college: "HKBK", prize: "₹8,000" },
          { place: "2nd", track: "Hardware", college: "Cambridge", prize: "₹4,000" },
          { place: "1st", track: "Software", college: "GEC Ramanagara", prize: "₹8,000" },
          { place: "2nd", track: "Software", college: "Atria IT", prize: "₹4,000" },
        ],
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1760969089/Untitled_design_h0ch4k.png",
      },
      {
        title: "Agentic AI Challenge",
        summary: "Teams built AI agents that act on a task rather than just answer about it.",
        host: "ATRAIC (AI) Club",
        sponsor: "Unstop",
        date: "6 Nov 2025",
        participants: { total: 88, inHouse: 56, external: 32 },
        teams: 44,
        winners: [
          { place: "1st", college: "MSRIT", teamName: "Agents", prize: "₹2,000" },
          { place: "2nd", college: "Atria IT", teamName: "Neuro Nomado", prize: "₹1,000" },
        ],
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1761040526/agentic_ai_do9mf7.jpg",
      },
      {
        title: "Intruverse",
        summary: "A capture-the-flag run across several challenge streams.",
        host: "Cybersecurity Club",
        date: "6 Nov 2025",
        participants: { total: 96, inHouse: 68, external: 28 },
        teams: 24,
        winners: [
          { place: "1st", college: "Ramaiah", teamName: "Windows12Devs", prize: "₹2,000" },
          { place: "2nd", college: "Atria", teamName: "Ctrl+We", prize: "₹1,000" },
        ],
        image: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760965058/intrucv_lqqi1l.jpg",
      },
      {
        title: "Proto Race",
        summary: "Decode the clues, find the IoT components, and get a build working against the clock.",
        host: "IoT Forge Club",
        date: "6 Nov 2025",
        participants: { total: 56, inHouse: 56, external: 0 },
        teams: 14,
        winners: [
          { place: "1st", college: "Atria", teamName: "Fusion Four", prize: "₹2,000" },
          { place: "2nd", college: "Atria", teamName: "VisionX", prize: "₹1,000" },
        ],
        image: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760965186/1_hfampo.jpg",
      },
      {
        title: "IPL Auction",
        summary: "An IPL-style player auction: bid within the purse and balance the squad.",
        date: "6 Nov 2025",
        participants: { total: 148, inHouse: 84, external: 64 },
        teams: 37,
        winners: [
          { place: "1st", college: "Atria", teamName: "CricWhispers", prize: "₹3,000" },
          // The report says "₹500 each" without saying each of what; left as written.
          { place: "2nd", college: "Atria", teamName: "The Hawks", prize: "₹500 each" },
        ],
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1760971638/ipl-2021-ix7zwgff29ylomuf_ina4fe.jpg",
      },
      {
        title: "24-Hour Hackathon",
        summary: "A day and a night of building, with mentorship through the checkpoints.",
        date: "7 – 8 Nov 2025",
        participants: { total: 596, inHouse: 36, external: 560 },
        teams: 157,
        winners: [
          { place: "1st", college: "Dayananda Sagar", prize: "₹15,000" },
          { place: "2nd", college: "Malnad College of Engineering", prize: "₹10,000" },
        ],
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1761035597/CICADA_HACKATHON_srpido.png",
      },
    ],
  },
]

/** Totals across an edition, summed rather than transcribed. */
export function editionTotals(edition: PastEdition) {
  return edition.events.reduce(
    (acc, event) => ({
      participants: acc.participants + event.participants.total,
      teams: acc.teams + event.teams,
      events: acc.events + 1,
    }),
    { participants: 0, teams: 0, events: 0 },
  )
}
