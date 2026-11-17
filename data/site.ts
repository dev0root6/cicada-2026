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
} as const

/**
 * Site-wide notice, shown above the navbar on every page and on the landing
 * teaser. Set `enabled: false` to take it down everywhere at once.
 */
/**
 * Site-wide notice, rendered at the top of the home page. It currently carries
 * the hackathon run sheet below; the dates themselves live in the hero.
 * Set `enabled: false` to take the whole notice down.
 */
export const announcement = {
  enabled: true,
  /** Short form, repeated in the scrolling ticker. */
  ticker: "19 – 21 November 2026 — registrations open — 24-hour hackathon schedule is out",
}

export type RunSheetItem = {
  time: string
  label: string
  /** Marks the beats that are the hackathon itself rather than the social programme. */
  key?: boolean
}

/**
 * Hour-by-hour run sheet for the 24-hour hackathon, shown inside the
 * announcement. Rendered in the order given — it reads as a night that runs
 * from the problem drop through to judging.
 */
export const hackathonRunSheet = {
  enabled: true,
  kicker: "Update — 24-hour hackathon",
  title: "The run sheet is live 🔓",
  lead: "Problem drops at 1 PM. Twenty-four hours later you are pitching. Here is every beat in between.",
  items: [
    { time: "1:00 – 2:00 PM", label: "Problem statement announcement", key: true },
    { time: "4:30 – 5:30 PM", label: "Snacks" },
    { time: "5:30 – 7:30 PM", label: "Cultural & entertainment" },
    { time: "5:30 PM – 7:30 AM", label: "Movie time — all night" },
    { time: "8:30 PM", label: "Dinner" },
    { time: "2:00 – 3:00 AM", label: "Midnight snacks" },
    { time: "8:30 AM", label: "Breakfast" },
    { time: "11:30 AM", label: "Evaluation starts", key: true },
  ] as RunSheetItem[],
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

export type FacultyMember = {
  name: string
  role: string
  photo?: string
}

/** Faculty credited on the brochure cover, after the convenor. */
export const facultyTeam: FacultyMember[] = [
  { name: "Ms. Sonia S B", role: "Faculty Coordinator", photo: "/team/sonia-s-b.webp" },
  { name: "Dr. Naveen Kumar", role: "Professor" },
  { name: "Dr. Kavitha S Patil", role: "Associate Professor" },
  { name: "Dr. Jyoti Metan", role: "Associate Professor" },
]

export const collegeLogo =
  "https://res.cloudinary.com/dx9bvma03/image/upload/v1761926582/College_Logo_gjwudh.png"

export type Sponsor = {
  name: string
  href?: string
  /** Without a logo the sponsor renders as a text wordmark. */
  logo?: string
  /** Tailwind width class — logos ship at wildly different aspect ratios. */
  width?: string
}

export const sponsors: Sponsor[] = [
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
