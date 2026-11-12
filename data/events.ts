export type EventPrize = {
  label: string
  amount: string
  perks?: string[]
}

export type EventNotice = {
  tone: "warning" | "info"
  title: string
  body?: string
}

export type Event = {
  slug: string
  title: string
  summary: string
  description: string
  clubName: string
  clubLogo?: string
  /** Omitted until the schedule is announced. */
  date?: string
  /** Clock window on the day, e.g. "11:00 AM – 1:30 PM". */
  time?: string
  Duration: string
  teamSize: string
  venue: string
  registrationFee: string
  mode?: string
  /**
   * External registration form. Leave unset while registrations are closed:
   * the Register buttons then lead to the "opening soon" page, which collects
   * emails for a priority notification.
   */
  registerUrl?: string
  coverImage?: string
  brochureImage?: string
  /** Short labels rendered as pills on the event card. */
  badges?: string[]
  /** Banner shown above the description on the detail page. */
  notice?: EventNotice
  /** Prize tiers, rendered in order. */
  prizes?: EventPrize[]
  /** What every participant walks away with. */
  participantReward?: string
  /** Mailbox for written queries. */
  contactEmail?: string
  /** object-fit / object-position tuning for the cover image. */
  imageFit?: "cover" | "contain"
  imagePosition?: string
}

/** Flagship events first, then in schedule order. */
/**
 * Shown instead of a fee while fees are under wraps. The real amounts are kept
 * as comments on each event; to publish one, uncomment its line and delete the
 * FEE_TBA line below it.
 */
export const FEE_TBA = "Yet to be announced"

/**
 * Shown instead of prize money while it's under wraps. Each prize keeps its
 * real amount in a comment; to publish it, put the amount back in place of
 * PRIZE_TBA. (Project Expo's description had its per-track amounts too:
 * ₹8,000 winners / ₹4,000 runners-up for both Software and Hardware.)
 */
export const PRIZE_TBA = "Yet to be announced"

/** Shown on events that don't list their prizes yet. */
export const DEFAULT_PRIZES: EventPrize[] = [{ label: "Prize pool", amount: PRIZE_TBA }]

/** True once an event's fee is a real amount rather than FEE_TBA. */
export function feeAnnounced(event: Event): boolean {
  return /\d/.test(event.registrationFee)
}

export const events: Event[] = [
  {
    slug: "hackathon",
    registerUrl: "https://konfhub.com/checkout/cicada-2026?ticketId=126992",
    badges: ["Flagship Event"],
    prizes: [
      { label: "1st Prize", amount: PRIZE_TBA /* was "₹15,000" — hidden until announced */, perks: ["E-Certificate"] },
      { label: "2nd Prize", amount: PRIZE_TBA /* was "₹10,000" — hidden until announced */, perks: ["E-Certificate"] },
    ],
    participantReward: "Exclusive Goodies + E-Certificates",
    imageFit: "cover",
    // Poster: keep its title band in view when cropped to a card or banner.
    imagePosition: "center 22%",
    coverImage: "/posters/hackathon.webp",
    brochureImage: "/posters/hackathon.webp",
    title: "CICADA Hackathon ",
    summary: "Build a software in 24 hours with mentorship and prizes.",
    description: ` <span class="text-white">A 24-Hour Innovation Marathon: Where Creativity Meets Code</span>\n\nGet ready for 24 hours of pure innovation, collaboration, and adrenaline!\nThis marathon brings together brilliant minds from across domains to solve real-world challenges through technology and creativity. Participants will collaborate in teams to prototype, build, and demo an AI-powered application under the guidance of expert mentors. The marathon focuses on pushing boundaries in Vision and Agents — encouraging teams to blend imagination with cutting-edge  tools to craft impactful solutions.\n\n <span class="text-white">Problem Statement Release</span>\n\nAt the start of the hackathon   , problem statements will be revealed, each designed to address pressing real-world issues. Teams must brainstorm, ideate, and select a statement that aligns with their skills and vision. They'll then turn their ideas into working prototypes — all within 24 hours.\n\n <span class="text-white">Event Phases</span>\n\n• Problem Statement Release – Discover and choose your challenge.\n• Ideation & Prototyping – Brainstorm innovative solutions and start building your MVP.\n• Mentorship Checkpoints – Get expert feedback and refine your solution with mentor guidance.\n• Final Presentation & Judging – Pitch your prototype to the judging panel and showcase your innovation.\n\n <span class="text-white">Perks & Amenities</span>\n\nWe've got your energy covered throughout the marathon!\n• 🥞 3 Full Meals:  Midnight snack , Dinner and Breakfast\n• 🍪 Snacks & Refreshments: Available throughout the event\n• 🍔 Midnight Burger Bash: Fuel for your late-night coding sprints\n• ☕ Tea & Coffee: Keep your neurons firing\n• 🎁 Exclusive Swags: Cool goodies for all participants\n• 💬 Mentorship & Networking: Interact with industry experts and tech leaders\n\n <span class="text-white">Final Showdown</span>\n\nShortlisted teams will present their prototypes to a panel of judges comprising industry professionals and academicians. The most innovative, impactful, and technically sound solutions will be crowned the winners — with exciting prizes and recognition awaiting them.`,
    clubName: "AIT  Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    time: "Starts 10:30 AM",
    Duration: "24 hours",
    teamSize: "3 - 4 members",
    venue: "Atria Institute of Technology",
    // registrationFee: "₹ 1200 per team", // hidden until fees are announced
    registrationFee: FEE_TBA,
    mode: "Offline",
  },
  {
    slug: "project-expo",
    registerUrl: "https://konfhub.com/checkout/cicada-2026?ticketId=126990",
    badges: ["7th-semester only"],
    notice: {
      tone: "info",
      title: "Eligibility: Open to 7th-semester students only",
    },
    prizes: [
      { label: "Winners", amount: PRIZE_TBA /* was "₹8,000" — hidden until announced */, perks: ["E-Certificate"] },
      { label: "Runner Up", amount: PRIZE_TBA /* was "₹4,000" — hidden until announced */, perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    imageFit: "cover",
    // Poster: keep its title band in view when cropped to a card or banner.
    imagePosition: "center 22%",
    coverImage: "/posters/project-expo.webp",
    brochureImage: "/posters/project-expo.webp",
    title: "Project Expo - The Innovation Show",
    summary: "Exclusive platform for 7th-semester students to present innovative projects to industry professionals and academic experts",
    description: `Project Expo is an exclusive platform for 7th-semester students to present their most innovative and impactful projects before a panel of industry professionals and academic experts. It's where creativity meets real-world problem-solving, and visionary ideas come to life through prototypes, research models, and tech demonstrations.\n\n<span class="text-white">Domains You Can Showcase In</span>\n\n🤖 Artificial Intelligence & Machine Learning\n🌐 Internet of Things (IoT)\n🔐 Cybersecurity\n⚙️ Robotics and Automation\n🌱 Green Technology & Sustainability\n📊 Data Science & Analytics\n💻 Web & Mobile Applications\n\nWhether you're showcasing a working prototype, a research-driven concept, or a tech-powered innovation, this is your moment to shine, connect, and inspire.\n\n <span class="text-white">Tracks & Prizes</span>\nTwo separate categories ensure fair recognition for all innovators:\n\n <span class="text-white">Software Track</span>\n🥇 Winners: Prize yet to be announced + E-Certificate\n🥈 Runners-up: Prize yet to be announced + E-Certificate\n\n <span class="text-white">Hardware Track</span>\n🥇 Winners: Prize yet to be announced + E-Certificate\n🥈 Runners-up: Prize yet to be announced + E-Certificate\n\n <span class="text-white">Event Highlights</span>\n• 100+ Projects on Display\n• Judging by Industry Professionals\n• Mentorship & Incubation Opportunities\n• Prizes & Certificates for Top Innovations\n• Networking with Industry Experts`,
    clubName: "Innovation Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    time: "9:00 AM – 5:00 PM",
    Duration: "Full day",
    teamSize: "Max of 4 members per team",
    venue: "Atria Institute of Technology",
    // registrationFee: "₹400 per team", // hidden until fees are announced
    registrationFee: FEE_TBA,
    mode: "Offline",
  },
  {
    slug: "ipl-auction",
    registerUrl: "https://konfhub.com/checkout/cicada-2026?ticketId=126946",
    prizes: [
      { label: "Winners", amount: PRIZE_TBA /* was "₹3,000" — hidden until announced */, perks: ["E-Certificate"] },
      { label: "Runner Up", amount: PRIZE_TBA /* was "₹1,000" — hidden until announced */, perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    imageFit: "cover",
    // Poster: keep its title band in view when cropped to a card or banner.
    imagePosition: "center 22%",
    coverImage: "/posters/ipl-auction.webp",
    brochureImage: "/posters/ipl-auction.webp",
    title: "IPL Auction: Cricket Strategy Challenge",
    summary: "Step into the shoes of an IPL team owner in this thrilling Auction Challenge where strategy meets cricketing genius!",
    description: `Step into the shoes of an IPL team owner in this thrilling Auction Challenge, where strategy meets cricketing genius!
With a fixed purse and a roster of real-world players, you'll compete head-to-head with other participants to bid, balance, and build your ultimate championship-winning squad.
Your goal? To craft the most powerful and cost-efficient team that can perform in every match condition — all while managing your budget wisely.

 <span class="text-white">Event Structure</span>
The challenge unfolds in two exciting rounds:

1. <span class="text-white">Round 1: Quiz Round</span> 
Show off your cricket knowledge! The top 10 teams from this round qualify for the grand auction.

2. <span class="text-white">Round 2: Auction Round</span> 
The real action begins! Compete in a live, dynamic auction to secure your dream players and form a balanced squad.

 <span class="text-white">Key Features</span>
• 📊 Realistic Player Database – Includes player stats, base prices, and roles
• 💻 Live Bidding Interface – Experience a fast-paced auction environment
• 🧠 Strategic Team Building – Balance your team across batsmen, bowlers, and all-rounders
• 💰 Budget Management – Every bid counts, so plan your spending carefully
• 🏅 Performance-Based Scoring – Win based on team strength, balance, and budget efficiency

🏏 <span class="text-white">How It Works</span>
• Each team receives a virtual budget to start.
• Players are auctioned in multiple rounds.
• Teams bid strategically to outsmart opponents.
• Build a balanced lineup with the right mix of roles.
• Winners are chosen based on team strength & budget efficiency.

🎯 <span class="text-white">Why Join</span>
• Engage in a fun, high-energy strategy challenge
• Test your cricket IQ and analytical thinking
• Compete for exciting prizes and recognition
• Experience the thrill of managing your own IPL franchise`,
    clubName: "Sports Analytics Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    time: "1:00 PM – 5:00 PM",
    Duration: "4 hours",
    teamSize: "3 members per team",
    venue: "Atria Institute of Technology",
    // registrationFee: "₹200 per team", // hidden until fees are announced
    registrationFee: FEE_TBA,
    mode: "Offline",
  },
  {
    slug: "free-fire",
    registerUrl: "https://konfhub.com/checkout/cicada-2026?ticketId=126991",
    prizes: DEFAULT_PRIZES,
    participantReward: "E-Certificates",
    imageFit: "cover",
    coverImage: "/posters/free-fire.webp",
    title: "Free Fire",
    summary:
      "Squad up for CICADA's Free Fire tournament — battle royale, knockout rounds, last squad standing.",
    description: `Drop in, loot fast and outlast everyone else.

CICADA's Free Fire tournament puts squads from across campus and beyond into the battle royale, playing for the title and the prize pool.

 <span class="text-white">What to expect</span>
• Squad-based battle royale matches
• Knockout rounds leading to a final
• Played on your own device

 <span class="text-white">Before you register</span>
The match format, schedule and full rulebook go out to registered squads ahead of the event. Register now to hold your squad's place and get those details first.`,
    clubName: "Team CICADA",
    Duration: "Yet to be announced",
    teamSize: "Yet to be announced",
    venue: "Atria Institute of Technology",
    registrationFee: FEE_TBA,
    mode: "Offline",
  },
  {
    slug: "bgmi",
    registerUrl: "https://konfhub.com/checkout/cicada-2026?ticketId=126998",
    prizes: DEFAULT_PRIZES,
    participantReward: "E-Certificates",
    imageFit: "cover",
    coverImage: "/posters/bgmi.webp",
    title: "BGMI",
    summary:
      "Battlegrounds Mobile India at CICADA — squads, classic maps, and the last team standing takes it.",
    description: `Erangel, Miramar, and whoever is still standing when the circle closes.

CICADA's BGMI tournament runs squad matches through to a final, playing for the title and the prize pool.

 <span class="text-white">What to expect</span>
• Squad matches across classic maps
• Points carried across rounds into a final
• Played on your own device

 <span class="text-white">Before you register</span>
The match format, schedule and full rulebook go out to registered squads ahead of the event. Register now to hold your squad's place and get those details first.`,
    clubName: "Team CICADA",
    Duration: "Yet to be announced",
    teamSize: "Yet to be announced",
    venue: "Atria Institute of Technology",
    registrationFee: FEE_TBA,
    mode: "Offline",
  },
]

/** Where an event's Register buttons point. */
export function registrationHref(event: Event): string {
  return event.registerUrl ?? `/events/${event.slug}/register`
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

/**
 * When an event starts, as a sortable number: its `date` ("Nov 4, 2026") plus
 * the first clock time in `time` ("11:00 AM – 1:30 PM", "Starts 10:30 AM").
 * Parsed by hand so it never depends on the JS engine's date-string quirks.
 *
 * With no date set, every event sorts by time alone, which is the running
 * order we can still state while the dates are unannounced.
 */
export function eventStart(event: Event): number {
  const d = event.date?.match(/([A-Za-z]{3})[A-Za-z]*\.?\s+(\d{1,2})[^\d]+(\d{4})/)
  const month = d ? MONTHS.indexOf(d[1].toLowerCase()) : -1
  const day = d && month >= 0 ? Date.UTC(Number(d[3]), month, Number(d[2])) : Number.MAX_SAFE_INTEGER

  const t = event.time?.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  let minutes = 0
  if (t) {
    const hour = (Number(t[1]) % 12) + (t[3].toUpperCase() === "PM" ? 12 : 0)
    minutes = hour * 60 + Number(t[2])
  }
  return day + minutes * 60_000
}

export type EventDay = {
  /** "Day 1", "Day 2", … in fest order. Absent while dates are unannounced. */
  label?: string
  /** The shared `date` string, e.g. "Nov 4, 2026". Absent until announced. */
  date?: string
  events: Event[]
}

/**
 * Every event in start order, grouped by day.
 *
 * Until the dates are announced there are no days to group by, so this returns
 * a single unlabelled group rather than inventing a "Day 1" that means nothing.
 */
export function eventsByDay(list: Event[] = events): EventDay[] {
  const sorted = [...list].sort((a, b) => eventStart(a) - eventStart(b))
  if (!sorted.some((event) => event.date?.trim())) return [{ events: sorted }]

  const days: EventDay[] = []
  for (const event of sorted) {
    const date = event.date?.trim() ?? ""
    const current = days[days.length - 1]
    if (current && current.date === date) current.events.push(event)
    else days.push({ label: `Day ${days.length + 1}`, date, events: [event] })
  }
  return days
}
