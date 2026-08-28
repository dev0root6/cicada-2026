/**
 * Single source of truth for everything that is "the fest" rather than "an event".
 * Changing the edition (name, year, dates) should only ever mean editing this file.
 */

export const site = {
  name: "CICADA",
  edition: "2025",
  get title() {
    return `${this.name} ${this.edition}`
  },
  tagline: "Atria Institute of Technology",
  description:
    "CICADA is AIT's annual technology festival — workshops, hackathons, competitions, talks and showcases hosted by clubs across campus.",
  logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760198155/cicada_logo_no_bg_m0sjov.png",
  brochure: "/Cicada Brochure-1_compress.pdf",
  dates: "Nov 5 – 7, 2025",
  venue: {
    name: "Atria Institute of Technology",
    city: "Hebbal, Bengaluru",
    mapUrl: "https://maps.google.com/maps?q=Atria+Institute+of+Technology+Hebbal+Bengaluru",
    mapImage:
      "https://res.cloudinary.com/dx9bvma03/image/upload/v1760723487/Screenshot_2025-10-17_232023_sctcqr.png",
  },
  social: {
    instagram: "https://www.instagram.com/cicada_atria?igsh=dmp0Ym1hM3dneXc3",
    email: "karansuthar9565@gmail.com",
  },
  credit: {
    label: "ScriptVerse",
    href: "https://script-verse-mu.vercel.app/",
  },
} as const

export type NavLink = {
  href: string
  label: string
  external?: boolean
}

export const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: site.brochure, label: "Brochure", external: true },
]

export const footerLinks: NavLink[] = [
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/project-expo", label: "Project Expo" },
  { href: "/terms", label: "Terms & Conditions" },
]

/** Organisers reachable from the footer / event pages. */
export const organizerContacts = [
  { name: "Priyanka", phone: "+91 8431822512" },
  { name: "Swarnim", phone: "+91 9986837400" },
  { name: "Karan Suthar", phone: "+91 8431770172" },
]

export const facultyLead = {
  name: "Dr. Deepak N R",
  role: "Head of Department (ISE)",
  org: "Atria Institute of Technology",
  photo:
    "https://res.cloudinary.com/dx9bvma03/image/upload/v1761909347/IMG_20251031_164104_cjnugo.jpg",
  phone: "+91 9886467667",
  instagram: "https://www.instagram.com/drdeepugowda?igsh=enE0bWk0c2xnOW1i",
  emails: [
    { label: "Work", address: "isehod@atria.edu" },
    { label: "Personal", address: "Deepaknrgowda@gmail.com" },
  ],
}

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
  logo: string
  /** Tailwind width class — logos ship at wildly different aspect ratios. */
  width: string
}

export const sponsors: Sponsor[] = [
  {
    name: "Monster Energy",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760802401/hd-white-monster-energy-logo-png-701751694778506qte0bhllt8-removebg-preview-removebg-preview_slhyah.png",
    width: "w-40 md:w-48",
  },
  {
    name: "Red Bull",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760348280/images__5_-removebg-preview_fjabqd.png",
    width: "w-32 md:w-40",
  },
  {
    name: "ScriptVerse",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1760803111/WhatsApp_Image_2025-10-16_at_18.17.03_e329bb39-removebg-preview_3_sa6q3n-removebg-preview_fcwkkq.png",
    width: "w-48 md:w-56",
  },
  {
    name: "Atria Foundation",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761825817/white_Atria_Foundation_1_1_kajka6.avif",
    width: "w-44 md:w-52",
  },
  {
    name: "IEEE Bangalore Section",
    logo: "https://res.cloudinary.com/dx9bvma03/image/upload/v1761826422/Bangalore-Section-Logo-white-1-01-1-1024x244_c1k3mb.png",
    width: "w-40 md:w-48",
  },
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
