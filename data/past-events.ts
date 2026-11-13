/**
 * Previous editions, for the archive section on the home page.
 *
 * Recovered from this repository's own history — the 2026 site was built by
 * redesigning the 2025 one, so these are that edition's real entries rather
 * than a retelling. Add a new block at the top each year.
 */

export type PastEvent = {
  title: string
  summary: string
  clubName: string
  date: string
  image: string
}

export type PastEdition = {
  /** "2025", used as the heading. */
  year: string
  /** Where and when it ran, shown under the year. */
  dates: string
  events: PastEvent[]
}

export const pastEditions: PastEdition[] = [
  {
    year: "2025",
    dates: "Nov 5 – 8, 2025",
    events: [
      {
        title: "CICADA Hackathon",
        summary: "Build a software in 24 hours with mentorship and prizes.",
        clubName: "AIT Club",
        date: "Nov 7 – 8, 2025",
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1761035597/CICADA_HACKATHON_srpido.png",
      },
      {
        title: "Project Expo — The Innovation Show",
        summary:
          "Exclusive platform for 7th-semester students to present innovative projects to industry professionals and academic experts.",
        clubName: "Innovation Club",
        date: "Nov 5, 2025",
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1760969089/Untitled_design_h0ch4k.png",
      },
      {
        title: "INTRUVERSE: The Local Breach",
        summary:
          "A high-octane CTF testing hacking, problem-solving and analytical skills across multiple challenge streams.",
        clubName: "Cybersecurity Club",
        date: "Nov 6, 2025",
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1760965058/intrucv_lqqi1l.jpg",
      },
      {
        title: "Agentic AI Challenge",
        summary:
          "Step into the next frontier of artificial intelligence by building AI agents that don't just respond — they act.",
        clubName: "AIT AI Club",
        date: "Nov 6, 2025",
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1761040526/agentic_ai_do9mf7.jpg",
      },
      {
        title: "PROTO RACE: The IoT Challenge",
        summary:
          "Decode clues, find IoT components, and build a working project in this high-energy campus race.",
        clubName: "IoT Forge Club",
        date: "Nov 6, 2025",
        image: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760965186/1_hfampo.jpg",
      },
      {
        title: "IPL Auction: Cricket Strategy Challenge",
        summary:
          "Step into the shoes of an IPL team owner where strategy meets cricketing genius.",
        clubName: "Sports Analytics Club",
        date: "Nov 6, 2025",
        image:
          "https://res.cloudinary.com/dx9bvma03/image/upload/v1760971638/ipl-2021-ix7zwgff29ylomuf_ina4fe.jpg",
      },
    ],
  },
]
