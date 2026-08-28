export type EventPrize = {
  label: string
  amount: string
  perks?: string[]
}

export type EventContact = {
  name: string
  phone: string
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
  date: string
  Duration: string
  teamSize: string
  venue: string
  registrationFee: string
  mode?: string
  registerUrl: string
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
  /** Organisers to call, shown in the contact dialog. */
  contacts?: EventContact[]
  /** Mailbox for written queries. */
  contactEmail?: string
  /** object-fit / object-position tuning for the cover image. */
  imageFit?: "cover" | "contain"
  imagePosition?: string
}


export const events: Event[] = [
  {
    slug: "hackathon",
    badges: ["Flagship Event", "On-Spot Only"],
    notice: {
      tone: "warning",
      title: "On-Spot Registrations Only",
      body: "Online registrations have been closed",
    },
    prizes: [
      { label: "1st Prize", amount: "₹15,000", perks: ["E-Certificate"] },
      { label: "2nd Prize", amount: "₹10,000", perks: ["E-Certificate"] },
    ],
    participantReward: "Exclusive Goodies + E-Certificates",
    contacts: [
      { name: "Swarnim", phone: "+91 9986837400" },
      { name: "Priyanka V C", phone: "+91 8431822512" },
      { name: "Sharanu", phone: "+91 8073525884" },
      { name: "Sneha", phone: "+91 7483075818" },
    ],
    imageFit: "cover",
    title: "CICADA Hackathon ",
    summary: "Build a software in 24 hours with mentorship and prizes.",
    description: ` <span class="text-white">A 24-Hour Innovation Marathon: Where Creativity Meets Code</span>\n\nGet ready for 24 hours of pure innovation, collaboration, and adrenaline!\nThis marathon brings together brilliant minds from across domains to solve real-world challenges through technology and creativity. Participants will collaborate in teams to prototype, build, and demo an AI-powered application under the guidance of expert mentors. The marathon focuses on pushing boundaries in Vision and Agents — encouraging teams to blend imagination with cutting-edge  tools to craft impactful solutions.\n\n <span class="text-white">Problem Statement Release</span>\n\nAt the start of the hackathon   , problem statements will be revealed, each designed to address pressing real-world issues. Teams must brainstorm, ideate, and select a statement that aligns with their skills and vision. They'll then turn their ideas into working prototypes — all within 24 hours.\n\n <span class="text-white">Event Phases</span>\n\n• Problem Statement Release – Discover and choose your challenge.\n• Ideation & Prototyping – Brainstorm innovative solutions and start building your MVP.\n• Mentorship Checkpoints – Get expert feedback and refine your solution with mentor guidance.\n• Final Presentation & Judging – Pitch your prototype to the judging panel and showcase your innovation.\n\n <span class="text-white">Perks & Amenities</span>\n\nWe've got your energy covered throughout the marathon!\n• 🥞 3 Full Meals:  Midnight snack , Dinner and Breakfast\n• 🍪 Snacks & Refreshments: Available throughout the event\n• 🍔 Midnight Burger Bash: Fuel for your late-night coding sprints\n• ☕ Tea & Coffee: Keep your neurons firing\n• 🎁 Exclusive Swags: Cool goodies for all participants\n• 💬 Mentorship & Networking: Interact with industry experts and tech leaders\n\n <span class="text-white">Final Showdown</span>\n\nShortlisted teams will present their prototypes to a panel of judges comprising industry professionals and academicians. The most innovative, impactful, and technically sound solutions will be crowned the winners — with exciting prizes and recognition awaiting them.`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761035597/CICADA_HACKATHON_srpido.png",
    brochureImage: "/hacakthon-poster.png",
    clubName: "AIT  Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    date: "Nov 7-8, 2026",
    Duration: "24 Hours ( starts at 2 pm )",
    teamSize: "3 - 4 members",
    venue: "Atria Institute of Technology",
    registrationFee: "₹ 1200 per team",
    mode: "Offline",
    registerUrl: "https://konfhub.com/cicada-2025", // replace later with Google Form
  },
  {
    slug: "ipl-auction",
    prizes: [
      { label: "Winners", amount: "₹3,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹1,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    contacts: [
      { name: "Karan Suthar", phone: "+91 8431770172" },
      { name: "Shivam Malge", phone: "+91 8618169821" },
    ],
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
    date: "Nov 6, 2026",
    Duration: "Endless fun",
    teamSize: "3 members per team",
    venue: "Atria Institute of Technology",
    registrationFee: "₹200 per team",
    mode: "Offline",
    registerUrl: "https://konfhub.com/cicada-2025",
  },
   {
    slug: "intruverse-ctf",
    prizes: [
      { label: "Winners", amount: "₹2,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹1,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    contacts: [
      { name: "Deva Kumar", phone: "+91 8431822512" },
      { name: "Aishwarya", phone: "+91 9148771379" },
      { name: "Charu Shree", phone: "+91 7019126145" },
      { name: "Prithvi Prabhu", phone: "+91 9611272227" },
    ],
    imageFit: "cover",
    imagePosition: "20% 30%",
    title: "INTRUVERSE: The Local Breach",
    summary: "A high-octane CTF competition testing your hacking, problem-solving, and analytical skills across multiple challenge streams",
    description: `Get ready for an intense cybersecurity showdown that pushes your hacking, problem-solving, and analytical skills to the limit!
Whether you're a beginner stepping into ethical hacking or an experienced player hungry for new challenges, this CTF competition is your chance to think like an attacker, act like a defender, and capture the flag!
Work in teams, collaborate under pressure, and compete to crack codes, uncover vulnerabilities, and claim the ultimate root flag.

⚔️ <span class="text-white">Challenge Streams</span>

1. 🌐 <span class="text-white">Web</span>
Dive into the digital underworld of the internet!
Explore logically crafted web challenges filled with hidden vulnerabilities, injection flaws, and misconfigurations waiting to be exploited.

2. 💻 <span class="text-white">VM (Virtual Machine)</span>
Step inside a simulated environment designed to mimic real-world system architectures.
Exploit vulnerabilities, navigate complex network topologies, and outsmart defense mechanisms to gain system-level access.

3. 🗂️ <span class="text-white">File System</span>
Put your forensic hat on!
Decrypt hidden data, reconstruct files, and analyze digital trails to uncover secrets buried deep within file systems.

  <span class="text-white">Why You Should Join</span>
• Open to beginners and experts alike
• Hands-on experience in ethical hacking & digital forensics
• Compete in a real-time cyber battle against top teams
• Learn, collaborate, and network with cybersecurity enthusiasts
• Exciting prizes, certificates, and bragging rights await the winners`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760965058/intrucv_lqqi1l.jpg",
    brochureImage: "/intruverse.png",
    clubName: "Cybersecurity Club",
    clubLogo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760269199/CyberSec-AIT_jtlgdt.png",
    date: "Nov 6, 2026",
    Duration: "3 - 4 hours",
    teamSize: "3 members per team",
    venue: "Atria Institute of Technology",
    registrationFee: "₹150 per team",
    mode: "Offline",
    registerUrl: "https://konfhub.com/cicada-2025",
  },
  
 
  {
    slug: "agentic-ai",
    prizes: [
      { label: "Winners", amount: "₹2,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹1,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    contacts: [
      { name: "Aman", phone: "+91 9483798153" },
      { name: "Mahima", phone: "+91 7483065137" },
      { name: "Manotosh", phone: "+91 8293017048" },
    ],
    imageFit: "cover",
    imagePosition: "center 30%",
    title: "Agentic AI Challenge",
    summary: "Step into the next frontier of artificial intelligence by building AI agents that don't just respond — they act.",
    description: `Step into the next frontier of artificial intelligence with the Agentic AI Challenge, where participants are tasked with building AI agents that don't just respond — they act. This challenge goes beyond traditional chatbot interactions and dives deep into agentic intelligence, where your AI can plan, reason, make decisions, and execute tasks independently. It's your chance to explore how autonomous agents can revolutionize productivity, problem-solving, and human-AI collaboration.

<span class="text-white">Your Mission</span>
Design and develop an AI Agent capable of:
• Reasoning: Analyzing inputs and forming logical conclusions
• Decision-Making: Choosing optimal actions based on context
• Autonomous Execution: Performing multi-step tasks without human intervention

Your agent could assist in research, automate workflows, manage data, or even act as an intelligent digital assistant — the possibilities are endless.

<span class="text-white">Tech Stack (Suggested)</span>
You're free to choose any stack or framework that empowers your agent to think and act.
Some recommended tools include:
• 🪄 LangChain – for chaining reasoning tasks
• 📚 LlamaIndex – for context and knowledge retrieval
• 🤗 Hugging Face – for powerful NLP models
• ⚡ FastAPI / Flask – to deploy your agent as an API
• 🧩 OpenAI Function Calling / Custom Logic – for complex decision-making

Bring your creativity — custom architectures and open-source frameworks are equally welcome!

<span class="text-white"> What We're Looking For</span>
• Innovative autonomous behavior and adaptability
• Strong reasoning and decision flow
• Effective real-world problem-solving ability
• Well-structured architecture and presentation

<span class="text-white"> Why You Should Join</span>
• Build a next-gen AI agent that mimics human reasoning
• Gain hands-on experience with cutting-edge AI tools and frameworks
• Collaborate and network with fellow innovators and AI enthusiasts
• Compete for recognition, prizes, and exposure in the world of intelligent systems`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761040526/agentic_ai_do9mf7.jpg",
    brochureImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761874370/Cicada_2025_brochure__20251030_215809_0000-3_gnsutz.png",
    clubName: "AIT AI Club",
    clubLogo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760378401/ai_club-removebg-preview_szuluv.png",
    date: "Nov 6, 2026",
    Duration: "4 - 6 hours",
    teamSize: "3 members per team",
    venue: "Atria Institute of Technology",
    registrationFee: "₹150 per team",
    mode: "Offline",
    registerUrl: "https://unstop.com/p/agentic-ai-ideathon-atria-institute-of-technology-1576729?utm_campaign=site-emails&utm_medium=d2c-automated&utm_source=congratulations-your-listing-for-agentic-ai-ideathon-is-complete",
  },
  
  
  
  
  {
    slug: "proto-race",
    prizes: [
      { label: "Winners", amount: "₹2,000", perks: ["E-Certificate"] },
      { label: "Runner Up", amount: "₹1,000", perks: ["E-Certificate"] },
    ],
    participantReward: "E-Certificates",
    contacts: [
      { name: "Tanushri M P", phone: "+91 8431418376" },
      { name: "Sherin", phone: "+91 9900350005" },
    ],
    imageFit: "cover",
    imagePosition: "center 25%",
    title: "PROTO RACE: The IoT Challenge",
    summary: "Decode clues, find IoT components, and build a working project in this high-energy campus race!",
    description: `Get ready for PROTO RACE, an innovative IoT-based campus challenge that blends tech, logic, and adventure into one thrilling experience!
Participants will embark on a quest to decode clues, locate hidden IoT components, and assemble a real-time working project — all against the clock.
It's not just about speed — it's about smart thinking, teamwork, and hands-on IoT mastery.

<span class="text-white">What's the Challenge?</span>
Teams will receive a series of clues related to IoT components used in a real-world project.
Each clue leads to a hidden component somewhere across the campus.
Once all components are found, teams must assemble the complete IoT setup, upload the code, and get it running successfully.
The first team to finish the build and execute the project wins the race!

<span class="text-white">Event Flow</span>
• 🔍 Clue Release – Teams receive their first clue hinting at an IoT component.
• 🧩 Decode & Locate – Crack the clue and find the hidden component in designated campus areas.
• 🛠️ Assemble the Project – Once all components are collected, assemble the given IoT project.
• 💻 Code Upload & Execution – Run your code and get the IoT setup working perfectly.
• 🏁 Race to Finish – The team that completes and demonstrates the project first wins!

<span class="text-white">Learning Outcomes</span>
• Hands-on experience with IoT components and sensors
• Enhanced problem-solving and logical reasoning
• Strengthened teamwork and collaboration
• Real-world understanding of IoT systems and implementation

<span class="text-white">Why You'll Love It</span>
• 🎯 A fun, fast-paced technical treasure hunt
• 🏃‍♂️ Mix of physical activity and tech application
• 🧠 Learn IoT by doing, building, and racing
• 🏆 Compete for exciting prizes and bragging rights`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760965186/1_hfampo.jpg",
    brochureImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761874413/Cicada_2025_brochure__20251030_215809_0000-6_td6zcm.png",
    clubName: "IoT Forge Club",
    clubLogo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760960677/iot_forge-modified_v2gvml.png",
    date: "Nov 6, 2026",
    Duration: "3 - 4 hours",
    teamSize: "Team of 4",
    venue: "Atria Institute of Technology",
    registrationFee: "₹150 per team",
    mode: "Offline",
    registerUrl: "https://konfhub.com/cicada-2025",
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
    contacts: [
      { name: "Shruthi Raj", phone: "+91 6204705418" },
      { name: "Kashik", phone: "+91 6360497813" },
      { name: "Kavan TB", phone: "+91 8951811235" },
      { name: "Shrajan", phone: "+91 7795264283" },
    ],
    imageFit: "contain",
    title: "Project Expo - The Innovation Show",
    summary: "Exclusive platform for 7th-semester students to present innovative projects to industry professionals and academic experts",
    description: `Project Expo is an exclusive platform for 7th-semester students to present their most innovative and impactful projects before a panel of industry professionals and academic experts. It's where creativity meets real-world problem-solving, and visionary ideas come to life through prototypes, research models, and tech demonstrations.\n\n<span class="text-white">Domains You Can Showcase In</span>\n\n🤖 Artificial Intelligence & Machine Learning\n🌐 Internet of Things (IoT)\n🔐 Cybersecurity\n⚙️ Robotics and Automation\n🌱 Green Technology & Sustainability\n📊 Data Science & Analytics\n💻 Web & Mobile Applications\n\nWhether you're showcasing a working prototype, a research-driven concept, or a tech-powered innovation, this is your moment to shine, connect, and inspire.\n\n <span class="text-white">Tracks & Prizes</span>\nTwo separate categories ensure fair recognition for all innovators:\n\n <span class="text-white">Software Track</span>\n🥇 Winners: ₹8,000 + E-Certificate\n🥈 Runners-up: ₹4,000 + E-Certificate\n\n <span class="text-white">Hardware Track</span>\n🥇 Winners: ₹8,000 + E-Certificate\n🥈 Runners-up: ₹4,000 + E-Certificate\n\n <span class="text-white">Event Highlights</span>\n• 100+ Projects on Display\n• Judging by Industry Professionals\n• Mentorship & Incubation Opportunities\n• Prizes & Certificates for Top Innovations\n• Networking with Industry Experts`,
    coverImage: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760969089/Untitled_design_h0ch4k.png",
    brochureImage: "/project-expo.png",
    clubName: "Innovation Club",
    clubLogo: "/ait-ai-club-logo.jpg",
    date: "Nov 5, 2026",
    Duration: "5–6 hrs",
    teamSize: "Max of 4 members per team",
    venue: "Atria Institute of Technology",
    registrationFee: "₹400 per team",
    mode: "Offline",
    registerUrl: "https://konfhub.com/cicada-2025",
  },
]
