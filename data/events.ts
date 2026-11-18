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
  /**
   * Titles that are one event on the brochure but sell their own ticket, e.g.
   * Free Fire runs under E-Sports. Titles sharing a group count once.
   */
  group?: string
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
 * Shown in place of a fee while an event's price is not settled. Every event
 * currently prices in rupees; this is here for the next one that does not.
 */
export const FEE_TBA = "Yet to be announced"

/**
 * Shown in place of prize money that is not announced yet. The prize panel
 * renders it as "to be announced" rather than an amount.
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
      { label: "1st Prize", amount: "₹15,000", perks: ["Internship opportunity", "Goodies", "E-Certificate"] },
      { label: "2nd Prize", amount: "₹10,000", perks: ["Internship opportunity", "Goodies", "E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    imageFit: "cover",
    // Poster: keep its title band in view when cropped to a card or banner.
    imagePosition: "center 22%",
    coverImage: "/posters/hackathon.webp",
    brochureImage: "/posters/hackathon.webp",
    title: "CICADA Hackathon ",
    summary: "Build a software in 24 hours with mentorship and prizes.",
    description: ` <span class="text-white">A 24-Hour Innovation Marathon: Where Creativity Meets Code</span>\n\nGet ready for 24 hours of pure innovation, collaboration, and adrenaline!\nThis marathon brings together brilliant minds from across domains to solve real-world challenges through technology and creativity. Participants will collaborate in teams to prototype, build, and demo an AI-powered application under the guidance of expert mentors. The marathon focuses on pushing boundaries in Vision and Agents — encouraging teams to blend imagination with cutting-edge  tools to craft impactful solutions.\n\n <span class="text-white">Problem Statement Release</span>\n\nAt the start of the hackathon   , problem statements will be revealed, each designed to address pressing real-world issues. Teams must brainstorm, ideate, and select a statement that aligns with their skills and vision. They'll then turn their ideas into working prototypes — all within 24 hours.\n\n <span class="text-white">Event Phases</span>\n\n• Problem Statement Release – Discover and choose your challenge.\n• Ideation & Prototyping – Brainstorm innovative solutions and start building your MVP.\n• Mentorship Checkpoints – Get expert feedback and refine your solution with mentor guidance.\n• Final Presentation & Judging – Pitch your prototype to the judging panel and showcase your innovation.\n\n <span class="text-white">Perks & Amenities</span>\n\nWe've got your energy covered throughout the marathon!\n• 🥞 2 Full Meals: Dinner and Breakfast\n• 🍪 Snacks & Refreshments: Available throughout the event\n• 💬 Mentorship & Networking: Interact with industry experts and tech leaders\n\n <span class="text-white">Final Showdown</span>\n\nShortlisted teams will present their prototypes to a panel of judges comprising industry professionals and academicians. The most innovative, impactful, and technically sound solutions will be crowned the winners — with exciting prizes and recognition awaiting them.`,
    clubName: "AIT  Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    date: "Nov 20, 2026",
    time: "Starts 10:30 AM",
    Duration: "24 hours, running into Nov 21",
    teamSize: "3 – 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹1,500 per team",
    mode: "Offline",
    notice: {
      tone: "info",
      title: "Registration fee revised to ₹1,500 per team",
      body:
        "We have already crossed 150+ registrations. With demand well past what we planned for, the fee has been revised from ₹1,000 to ₹1,500 per team. Seats remain limited and are confirmed in the order payments come in.",
    },
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
      // Hardware and Software are judged as separate tracks, each paying out in full.
      { label: "Winner · Hardware", amount: "₹4,000", perks: ["E-Certificate"] },
      { label: "Runner Up · Hardware", amount: "₹2,000", perks: ["E-Certificate"] },
      { label: "Winner · Software", amount: "₹4,000", perks: ["E-Certificate"] },
      { label: "Runner Up · Software", amount: "₹2,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    imageFit: "cover",
    // Poster: keep its title band in view when cropped to a card or banner.
    imagePosition: "center 22%",
    coverImage: "/posters/project-expo.webp",
    brochureImage: "/posters/project-expo.webp",
    title: "Project Expo - The Innovation Show",
    summary: "Exclusive platform for 7th-semester students to present innovative projects to industry professionals and academic experts",
    description: `Project Expo is an exclusive platform for 7th-semester students to present their most innovative and impactful projects before a panel of industry professionals and academic experts. It's where creativity meets real-world problem-solving, and visionary ideas come to life through prototypes, research models, and tech demonstrations.\n\n<span class="text-white">Domains You Can Showcase In</span>\n\n🤖 Artificial Intelligence & Machine Learning\n🌐 Internet of Things (IoT)\n🔐 Cybersecurity\n⚙️ Robotics and Automation\n🌱 Green Technology & Sustainability\n📊 Data Science & Analytics\n💻 Web & Mobile Applications\n\nWhether you're showcasing a working prototype, a research-driven concept, or a tech-powered innovation, this is your moment to shine, connect, and inspire.\n\n <span class="text-white">Tracks & Prizes</span>\nTwo separate categories ensure fair recognition for all innovators:\n\n <span class="text-white">Software Track</span>\n🥇 Winner: ₹4,000 + E-Certificate\n🥈 Runner-up: ₹2,000 + E-Certificate\n\n <span class="text-white">Hardware Track</span>\n🥇 Winner: ₹4,000 + E-Certificate\n🥈 Runner-up: ₹2,000 + E-Certificate\n\n <span class="text-white">Event Highlights</span>\n• 100+ Projects on Display\n• Judging by Industry Professionals\n• Mentorship & Incubation Opportunities\n• Prizes & Certificates for Top Innovations\n• Networking with Industry Experts`,
    clubName: "Innovation Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    date: "Nov 19, 2026",
    time: "10:00 AM – 1:00 PM",
    Duration: "3 hours",
    teamSize: "Up to 4 members per team",
    venue: "Atria Institute of Technology",
    registrationFee: "₹400 per team",
    mode: "Offline",
  },
  {
    slug: "ipl-auction",
    registerUrl: "https://konfhub.com/checkout/cicada-2026?ticketId=126946",
    prizes: [
      { label: "Winner", amount: "₹2,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹1,000", perks: ["E-Certificate"] },
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
With a fixed purse and a roster of real-world players, you'll go head-to-head with other teams to bid, balance, and build your ultimate championship-winning squad.
Your goal? To craft the most powerful and cost-efficient team that can perform in every match condition — all while managing your budget wisely.

 <span class="text-white">Event Structure</span>
The challenge unfolds over two exciting rounds:

1. <span class="text-white">Round 1: Quiz Round (Online)</span>
Show off your cricket knowledge! This round is held online, and the top 10 teams qualify for the grand auction.

2. <span class="text-white">Round 2: Auction Round (On Campus)</span>
The real action begins! The auction is conducted through a live presentation — players go under the hammer slide by slide, and teams bid to build a balanced squad.

 <span class="text-white">Key Features</span>
• 📊 Realistic Player Database – player stats, base prices, and roles
• 🖥️ Presentation-Led Auction – players are revealed slide by slide as the bidding unfolds
• 🧠 Strategic Team Building – balance your squad across batsmen, bowlers, and all-rounders
• 💰 Budget Management – every bid counts, so plan your spending carefully
• 🏅 Performance-Based Scoring – win on team strength, balance, and budget efficiency

🏏 <span class="text-white">How It Works</span>
• Qualify for the auction through the online quiz round.
• Each team receives a virtual budget before the bidding begins.
• Players are auctioned slide by slide, over multiple rounds.
• Teams bid strategically to outsmart their opponents.
• Build a balanced line-up with the right mix of roles.
• Winners are chosen on team strength and budget efficiency.

🎯 <span class="text-white">Why Join</span>
• Take part in a fun, high-energy strategy challenge
• Test your cricket IQ and analytical thinking
• Compete for exciting prizes and recognition
• Experience the thrill of managing your own IPL franchise`,
    clubName: "Sports Analytics Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    date: "Nov 19, 2026",
    time: "1:00 PM – 5:00 PM",
    Duration: "4 hours",
    teamSize: "3 – 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹300 per team",
    mode: "Hybrid — Round 1 online, Round 2 on campus",
  },
  {
    slug: "free-fire",
    group: "E-Sports",
    registerUrl: "https://konfhub.com/checkout/cicada-2026?ticketId=126991",
    prizes: [
      { label: "Winner", amount: "₹2,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹1,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    imageFit: "cover",
    coverImage: "/posters/free-fire.webp",
    brochureImage: "/posters/free-fire.webp",
    title: "Free Fire",
    summary:
      "Squad up for CICADA's Free Fire tournament — battle royale, knockout rounds, last squad standing.",
    description: `Drop in, loot fast and outlast everyone else — CICADA's Free Fire bracket.

E-Sports is a competitive world of gaming where skill, strategy and teamwork come together. It turns a passion for gaming into thrilling challenges, unforgettable victories and real opportunities.

 <span class="text-white">Format</span>
• Squads of 3 – 4 players
• Matches run 9:00 AM to 12:00 PM on 20 November
• Played on your own device

 <span class="text-white">Before you register</span>
The match format, maps and full rulebook go out to registered squads ahead of the event. Register now to hold your squad's place and get those details first.`,
    clubName: "Team CICADA",
    date: "Nov 20, 2026",
    time: "9:00 AM – 12:00 PM",
    Duration: "3 hours",
    teamSize: "3 – 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹300 per team",
    mode: "Offline",
  },
]

/**
 * How many events the fest has, as the brochure counts them: titles sharing a
 * `group` (the two E-Sports brackets) count once.
 */
export function countEvents(list: Event[] = events): number {
  return new Set(list.map((event) => event.group ?? event.slug)).size
}

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
