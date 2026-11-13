/**
 * Single source of truth for everything that is "the fest" rather than "an event".
 * Changing the edition (name, year, dates) should only ever mean editing this file.
 */

export const site = {
  name: "CICADA",
  edition: "2026",
  get title() {
    return `${this.name} ${this.edition}`
  },
  tagline: "Atria Institute of Technology",
  description:
    "CICADA is AIT's annual technology festival — workshops, hackathons, competitions, talks and showcases hosted by clubs across campus.",
  logo: "/brand/cicada-bug.svg",
  brochure: "/Cicada-Brochure-2026.pdf",
  /** Set once confirmed; null until then and the site says so. */
  dates: "Nov 19 – 21, 2026" as string | null,
  /** Compact form for the hero stat tile. */
  shortDates: "Nov 19–21" as string | null,
  /** Daily gate hours from the brochure. */
  hours: "8:30 AM – 5:30 PM",
  venue: {
    name: "Atria Institute of Technology",
    city: "Hebbal, Bengaluru",
    mapUrl: "https://maps.google.com/maps?q=Atria+Institute+of+Technology+Hebbal+Bengaluru",
    mapImage:
      "https://res.cloudinary.com/dx9bvma03/image/upload/v1760723487/Screenshot_2025-10-17_232023_sctcqr.png",
  },
  social: {
    instagram: "https://www.instagram.com/cicada_atria?igsh=dmp0Ym1hM3dneXc3",
  },
  credit: {
    label: "ScriptVerse",
    href: "https://script-verse-mu.vercel.app/",
  },
} as const

/**
 * Site-wide notice, shown above the navbar on every page and on the landing
 * teaser. Set `enabled: false` to take it down everywhere at once.
 */
export const announcement = {
  enabled: true,
  kicker: "CICADA 2026 — Dates announced",
  /** The one line that has to land. Kept short so it can run at display size. */
  title: "19 – 21 November 2026 🚀",
  lines: [
    "The wait is over — CICADA 2026 has its dates! 🔥",
    "Three days at Atria Institute of Technology, 8:30 AM to 5:30 PM.",
    "Project Expo, IPL Auction, E-Sports and a 24-hour Hackathon. Registrations are open.",
  ],
  /**
   * One extra beat under the main lines, for programming worth calling out on
   * its own. Set to null when there is nothing to add.
   */
  highlight: {
    icon: "🎬",
    text: "Movie show from 5 PM onwards — Friday, 20 November",
  } as { icon: string; text: string } | null,
  hashtags: ["#CICADA2026", "#AtriaInstituteOfTechnology", "#SaveTheDate"],
  /** Short form, repeated in the scrolling ticker. */
  ticker: "19 – 21 November 2026 — registrations open",
}

/** Shown wherever a date would go while the schedule is unconfirmed. */
export const DATES_TBA = "Dates to be announced"
export const DATE_TBA_SHORT = "TBA"

export type NavLink = {
  href: string
  label: string
  external?: boolean
}

export const navLinks: NavLink[] = [
  { href: "/home", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: site.brochure, label: "Brochure", external: true },
]

export const footerLinks: NavLink[] = [
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms & Conditions" },
]

export type OrganizerContact = {
  name: string
  role: string
  phone: string
  /** Square portrait. Without one the card falls back to initials. */
  photo?: string
}

/**
 * The fest's contacts. This is the single list used everywhere — footer,
 * event pages, the contact dialog — so there is one place to change it.
 */
export const organizerContacts: OrganizerContact[] = [
  {
    name: "Ms. Sonia S B",
    role: "Faculty Coordinator",
    phone: "+91 81973 96564",
    photo: "/team/sonia-s-b.webp",
  },
  { name: "Deva Kumar S", role: "Student Coordinator", phone: "+91 96327 72904" },
  { name: "Mohammed Rehan", role: "Student Coordinator", phone: "+91 98869 24883" },
]

/**
 * Shown on the About page as a credit only. Personal contact details are
 * deliberately not held here — every way to reach the fest goes through
 * `organizerContacts` above.
 */
export const facultyLead = {
  name: "Dr. Deepak N R",
  role: "Convenor · Head of Department (ISE)",
  org: "Atria Institute of Technology",
  photo:
    "https://res.cloudinary.com/dx9bvma03/image/upload/v1761909347/IMG_20251031_164104_cjnugo.jpg",
}

/** Faculty credited on the brochure cover, after the convenor. */
export const facultyTeam = [
  { name: "Dr. Keshavamurthy", role: "Co-Convenor · HoD, ECE" },
  { name: "Dr. Naveen Kumar", role: "Professor" },
  { name: "Dr. Kavitha S Patil", role: "Associate Professor" },
  { name: "Dr. Jyoti Metan", role: "Associate Professor" },
]

export const collegeLogo =
  "https://res.cloudinary.com/dx9bvma03/image/upload/v1761926582/College_Logo_gjwudh.png"

export type Club = {
  name: string
  logo: string
  /** Some logos are transparent PNGs that need a ring to read on dark. */
  ringed?: boolean
}

export const clubs: Club[] = [
  {
    name: "CyberSec Club",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760269199/CyberSec-AIT_jtlgdt.png",
  },
  {
    name: "IoT Forge Club",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760960677/iot_forge-modified_v2gvml.png",
    ringed: true,
  },
  {
    name: "AI Club",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760378401/ai_club-removebg-preview_szuluv.png",
  },
  {
    name: "E-Cell Atria",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760959250/E-Cell_Atria_Logo_Option_4_1_h0lvih.jpg",
    ringed: true,
  },
]

export type Sponsor = {
  name: string
  href?: string
  /** Without a logo the sponsor renders as a text wordmark. */
  logo?: string
  /** Tailwind width class — logos ship at wildly different aspect ratios. */
  width?: string
}

export const sponsors: Sponsor[] = [
  { name: "Ellipsonic", href: "https://ellipsonic.com/" },
  { name: "HackoSquad", href: "https://www.hackosquad.com/" },
  { name: "CAREERTERK" },
  { name: "TECHFORCZ" },
]

export const galleryImages = [
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082488/IMG_0496_gtt0e0.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762083748/IMG_0495_mkkui2.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762083662/IMG_0432_ix6x17.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082508/IMG_0438_olz5lg.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082494/IMG_0442_gomaag.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082473/IMG_0570_i4fdqm.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082466/IMG_0574_evpjos.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082464/IMG_0586_lbzf1v.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082458/IMG_0587_rbf0xo.jpg",
  "https://res.cloudinary.com/dx9bvma03/image/upload/f_auto,q_auto,w_800/v1762082445/IMG_0585_fhv4lb.jpg",
]

export const pillars = [
  { title: "Hands-on First", body: "Learn by building with mentors and peers." },
  { title: "Multi-Club", body: "AI, Robotics, Cybersecurity, Design, Dev & more." },
  { title: "Showcase", body: "Demos, prize tracks, and campus-wide recognition." },
  { title: "Open to All", body: "Solo or teams — beginners welcome." },
]
