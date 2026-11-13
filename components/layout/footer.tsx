"use client"

import Link from "next/link"
import { useState } from "react"
import { Instagram, MapPin, Phone } from "lucide-react"
import { Container } from "@/components/common/container"
import { ContactDialog } from "@/components/common/contact-dialog"
import { Logo } from "@/components/brand/logo"
import { footerLinks, organizerContacts, site } from "@/data/site"

export function Footer() {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <footer className="mt-auto border-t border-border bg-background/80">
      <Container size="wide">
        <div className="grid gap-12 py-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/home" aria-label="CICADA 2026 home" className="inline-block">
              <Logo size="md" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>

          <nav className="md:col-span-3">
            <h2 className="eyebrow">Explore</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="eyebrow">Get in touch</h2>
            <a
              href={site.venue.mapUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 flex items-start gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {site.venue.name}
                <br />
                {site.venue.city}
              </span>
            </a>

            <div className="mt-5 flex items-center gap-2">
              <IconLink
                href={site.social.instagram}
                label="Instagram"
                external
                icon={<Instagram className="h-4 w-4" />}
              />
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                aria-label="Phone numbers"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Phone className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container size="wide">
          <div className="flex flex-col items-center justify-between gap-2 py-6 font-mono text-xs text-muted-foreground sm:flex-row">
            <p>
              © {site.edition} {site.name}
            </p>
            {/* Desktop only: the bug games need a mouse (public/brand/cicada-games.js). */}
            <button
              type="button"
              onClick={() => window.CicadaGames?.open()}
              className="hidden uppercase tracking-[0.18em] text-primary/80 transition-colors hover:text-primary [@media(hover:hover)_and_(pointer:fine)]:inline"
            >
              {"// Play with the bug"}
            </button>
          </div>
        </Container>
      </div>

      <ContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        people={organizerContacts}
      />
    </footer>
  )
}

function IconLink({
  href,
  label,
  icon,
  external,
}: {
  href: string
  label: string
  icon: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      aria-label={label}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
    >
      {icon}
    </a>
  )
}
