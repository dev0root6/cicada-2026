import type { Metadata } from "next"
import { Instagram, Mail, Phone } from "lucide-react"
import { Section } from "@/components/common/section"
import { ContactDialog } from "@/components/common/contact-dialog"
import { clubs, collegeLogo, facultyLead, site } from "@/data/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "About",
  description: site.description,
}

const values = [
  {
    title: "Mission",
    body: "Empower students to explore, prototype, and ship ideas together — bridging disciplines and experience levels.",
  },
  {
    title: "Vision",
    body: "Foster a collaborative tech ecosystem where innovation thrives, ideas transform into solutions, and students gain real-world experience.",
  },
  {
    title: "Community",
    body: "Build meaningful connections, network with mentors, and collaborate with peers passionate about technology and problem-solving.",
  },
]

export default function AboutPage() {
  return (
    <>
      <Section
        size="wide"
        eyebrow="Who we are"
        title={`About ${site.name}`}
        description={`${site.name} is the annual technology festival of ${site.venue.name}. It unites student clubs to host workshops, hackathons, competitions, and talks that champion learning by building.`}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {values.map((value, index) => (
            <div key={value.title} className="surface surface-hover p-6">
              <p className="font-mono text-xs text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-3 text-lg font-semibold">{value.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        size="wide"
        align="center"
        eyebrow="Hosted by"
        title="Participating clubs"
        className="border-y border-border bg-card/30"
      >
        <ul className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {clubs.map((club) => (
            <li key={club.name} className="flex flex-col items-center gap-3 text-center">
              <img
                src={club.logo}
                alt=""
                aria-hidden
                loading="lazy"
                className={cn(
                  "h-24 w-24 rounded-full object-cover md:h-28 md:w-28",
                  club.ringed && "border-2 border-border",
                )}
              />
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
                {club.name}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section size="wide" eyebrow="Faculty" title="Organizers">
        <div className="surface grid items-center gap-8 p-8 md:grid-cols-2 md:p-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <img
              src={facultyLead.photo}
              alt=""
              aria-hidden
              className="h-32 w-32 shrink-0 rounded-full object-cover ring-2 ring-border md:h-40 md:w-40"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold">{facultyLead.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{facultyLead.role}</p>
              <p className="text-sm text-muted-foreground">{facultyLead.org}</p>

              <div className="mt-4 flex items-center justify-center gap-2 sm:justify-start">
                <a
                  href={`tel:${facultyLead.phone.replace(/\s/g, "")}`}
                  aria-label={`Call ${facultyLead.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={facultyLead.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <ContactDialog
                  title="Email"
                  description="Choose an address to continue:"
                  emails={facultyLead.emails}
                  trigger={
                    <button
                      type="button"
                      aria-label="Email"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  }
                />
              </div>
            </div>
          </div>

          <img
            src={collegeLogo}
            alt={`${site.venue.name} logo`}
            loading="lazy"
            className="mx-auto w-56 object-contain md:ml-auto md:mr-0 md:w-64"
          />
        </div>
      </Section>
    </>
  )
}
