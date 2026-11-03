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
export const events: Event[] = [
  {
    slug: "hackathon",
    badges: ["Flagship Event"],
    prizes: [
      { label: "1st Prize", amount: "₹15,000", perks: ["E-Certificate"] },
      { label: "2nd Prize", amount: "₹10,000", perks: ["E-Certificate"] },
    ],
    participantReward: "Exclusive Goodies + E-Certificates",
    imageFit: "cover",
    title: "CICADA Hackathon ",
    summary: "Build a software in 24 hours with mentorship and prizes.",
    description: ` <span class="text-white">A 24-Hour Innovation Marathon: Where Creativity Meets Code</span>\n\nGet ready for 24 hours of pure innovation, collaboration, and adrenaline!\nThis marathon brings together brilliant minds from across domains to solve real-world challenges through technology and creativity. Participants will collaborate in teams to prototype, build, and demo an AI-powered application under the guidance of expert mentors. The marathon focuses on pushing boundaries in Vision and Agents — encouraging teams to blend imagination with cutting-edge  tools to craft impactful solutions.\n\n <span class="text-white">Problem Statement Release</span>\n\nAt the start of the hackathon   , problem statements will be revealed, each designed to address pressing real-world issues. Teams must brainstorm, ideate, and select a statement that aligns with their skills and vision. They'll then turn their ideas into working prototypes — all within 24 hours.\n\n <span class="text-white">Event Phases</span>\n\n• Problem Statement Release – Discover and choose your challenge.\n• Ideation & Prototyping – Brainstorm innovative solutions and start building your MVP.\n• Mentorship Checkpoints – Get expert feedback and refine your solution with mentor guidance.\n• Final Presentation & Judging – Pitch your prototype to the judging panel and showcase your innovation.\n\n <span class="text-white">Perks & Amenities</span>\n\nWe've got your energy covered throughout the marathon!\n• 🥞 3 Full Meals:  Midnight snack , Dinner and Breakfast\n• 🍪 Snacks & Refreshments: Available throughout the event\n• 🍔 Midnight Burger Bash: Fuel for your late-night coding sprints\n• ☕ Tea & Coffee: Keep your neurons firing\n• 🎁 Exclusive Swags: Cool goodies for all participants\n• 💬 Mentorship & Networking: Interact with industry experts and tech leaders\n\n <span class="text-white">Final Showdown</span>\n\nShortlisted teams will present their prototypes to a panel of judges comprising industry professionals and academicians. The most innovative, impactful, and technically sound solutions will be crowned the winners — with exciting prizes and recognition awaiting them.`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761035597/CICADA_HACKATHON_srpido.png",
    brochureImage: "/hacakthon-poster.png",
    clubName: "AIT  Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    time: "Starts 2:00 PM",
    Duration: "24 hours",
    teamSize: "3 - 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹ 1200 per team",
    mode: "Offline",
  },
  {
    slug: "bug-off",
    badges: ["Flagship Event"],
    imageFit: "cover",
    title: "Bug Off",
    summary: "Drop into a broken codebase, hunt down every defect and get the program running clean — against the clock.",
    description: `Every developer knows the pain — code that should work but doesn't. Bug Off drops your team into a broken codebase and challenges you to hunt down every defect, patch it, and get the program running clean.

<span class="text-white">The Challenge</span>
It's a race against the clock and against faulty logic.
• 🐞 Hunt – Track down every defect hiding in the codebase.
• 🩹 Patch – Fix the bugs without breaking anything else.
• ✅ Run clean – Get the program working end to end before time runs out.`,
    clubName: "CICADA 2026",
    time: "2:00 PM – 4:00 PM",
    Duration: "2 hours",
    teamSize: "2 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹150 per team",
    mode: "Offline",
  },
  {
    slug: "project-expo",
    badges: ["7th-semester only"],
    notice: {
      tone: "info",
      title: "Eligibility: Open to 7th-semester students only",
    },
    prizes: [
      { label: "Winners", amount: "₹8,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹4,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    imageFit: "contain",
    title: "Project Expo - The Innovation Show",
    summary: "Exclusive platform for 7th-semester students to present innovative projects to industry professionals and academic experts",
    description: `Project Expo is an exclusive platform for 7th-semester students to present their most innovative and impactful projects before a panel of industry professionals and academic experts. It's where creativity meets real-world problem-solving, and visionary ideas come to life through prototypes, research models, and tech demonstrations.\n\n<span class="text-white">Domains You Can Showcase In</span>\n\n🤖 Artificial Intelligence & Machine Learning\n🌐 Internet of Things (IoT)\n🔐 Cybersecurity\n⚙️ Robotics and Automation\n🌱 Green Technology & Sustainability\n📊 Data Science & Analytics\n💻 Web & Mobile Applications\n\nWhether you're showcasing a working prototype, a research-driven concept, or a tech-powered innovation, this is your moment to shine, connect, and inspire.\n\n <span class="text-white">Tracks & Prizes</span>\nTwo separate categories ensure fair recognition for all innovators:\n\n <span class="text-white">Software Track</span>\n🥇 Winners: ₹8,000 + E-Certificate\n🥈 Runners-up: ₹4,000 + E-Certificate\n\n <span class="text-white">Hardware Track</span>\n🥇 Winners: ₹8,000 + E-Certificate\n🥈 Runners-up: ₹4,000 + E-Certificate\n\n <span class="text-white">Event Highlights</span>\n• 100+ Projects on Display\n• Judging by Industry Professionals\n• Mentorship & Incubation Opportunities\n• Prizes & Certificates for Top Innovations\n• Networking with Industry Experts`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760969089/Untitled_design_h0ch4k.png",
    brochureImage: "/project-expo.png",
    clubName: "Innovation Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    time: "9:00 AM – 5:00 PM",
    Duration: "Full day",
    teamSize: "Max of 4 members per team",
    venue: "Atria Institute of Technology",
    registrationFee: "₹400 per team",
    mode: "Offline",
  },
  {
    slug: "who-am-i",
    imageFit: "cover",
    imagePosition: "20% 30%",
    title: "WHO AM I?",
    summary: "A case-based Capture the Flag challenge — investigate realistic cyber cases, follow the attack trail and uncover the final flag.",
    description: `A case-based Capture the Flag challenge where teams investigate realistic cyber cases, analyze digital evidence, follow hidden clues, connect the attack trail, and uncover the final flag.

<span class="text-white">How It Works</span>
• 🗂️ Investigate – Each team is handed a realistic cyber case to work through.
• 🔍 Analyze – Examine the digital evidence and pick out what matters.
• 🧩 Follow the clues – Hidden hints lead from one piece of evidence to the next.
• 🔗 Connect the trail – Piece together how the attack unfolded.
• 🚩 Capture the flag – Uncover the final flag before the clock runs out.`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760965058/intrucv_lqqi1l.jpg",
    clubName: "Cybersecurity Club",
    clubLogo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760269199/CyberSec-AIT_jtlgdt.png",
    time: "11:00 AM – 1:30 PM",
    Duration: "2 hrs 30 min",
    teamSize: "3 - 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹200 per team",
    mode: "Offline",
  },
  {
    slug: "aeromaneuver",
    imageFit: "cover",
    title: "AEROMANEUVER",
    summary: "Advanced UAV Navigation & Agility Challenge",
    description: `<span class="text-white">Advanced UAV Navigation & Agility Challenge</span>

Push the limits of aerial autonomy, precision, and maneuverability through a dynamic obstacle course designed to challenge every aspect of drone flight.

Navigate complex obstacles, adapt to unpredictable flight conditions, and complete the mission with speed, precision, and control.`,
    clubName: "Drone Club",
    time: "9:00 AM – 1:30 PM",
    Duration: "4 hrs 30 min",
    teamSize: "Max of 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹800 per team",
    mode: "Offline",
  },
  {
    slug: "agent-arena",
    imageFit: "cover",
    imagePosition: "center 30%",
    title: "AGENT ARENA 2026",
    summary: "Think. Build. Compete. Get a problem statement at the start and ship an AI agent that solves it — in 3.5 hours.",
    description: `<span class="text-white">Think. Build. Compete.</span>

A time-bound Agentic AI building competition where participants receive a problem statement at the start of the event and must design, develop, and demonstrate an AI agent specifically to solve that challenge.

<span class="text-white">Event Flow</span>
• 📜 Problem Statement Release – The challenge is revealed when the event begins.
• 🧠 Design – Plan how your agent will reason, decide and act.
• 🛠️ Build – Develop the agent against the clock.
• 🎤 Demonstrate – Show your agent solving the challenge.`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761040526/agentic_ai_do9mf7.jpg",
    clubName: "ATRAIC",
    clubLogo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760378401/ai_club-removebg-preview_szuluv.png",
    time: "10:00 AM – 1:30 PM",
    Duration: "3 hrs 30 min",
    teamSize: "3 - 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹200 per team",
    mode: "Offline",
  },
  {
    slug: "ipl-auction",
    prizes: [
      { label: "Winners", amount: "₹3,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹1,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    imageFit: "cover",
    imagePosition: "center 20%",
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
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760971638/ipl-2021-ix7zwgff29ylomuf_ina4fe.jpg",
    brochureImage: "/ipl-auction.png",
    clubName: "Sports Analytics Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    time: "1:00 PM – 5:00 PM",
    Duration: "4 hours",
    teamSize: "3 members per team",
    venue: "Atria Institute of Technology",
    registrationFee: "₹200 per team",
    mode: "Offline",
  },
]

/** Where an event's Register buttons point. */
export function registrationHref(event: Event): string {
  return event.registerUrl ?? `/events/${event.slug}/register`
}
