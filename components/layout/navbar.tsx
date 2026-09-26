"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Container } from "@/components/common/container"
import { navLinks, site } from "@/data/site"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()
  const scrolled = useScrolled()

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-sm",
      )}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4">
          <Brand />

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <NavItem key={link.href} link={link} active={pathname === link.href} />
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/events">Join the Fest</Link>
            </Button>
            <MobileNav pathname={pathname} />
          </div>
        </div>
      </Container>
    </header>
  )
}

function Brand() {
  return (
    <Link href="/home" className="group flex items-center gap-3">
      <img
        src={site.logo}
        alt=""
        aria-hidden
        className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-base font-semibold tracking-tight">{site.name}</span>
        <span className="font-mono text-[0.65rem] tracking-[0.2em] text-primary">
          {site.edition}
        </span>
      </span>
    </Link>
  )
}

function NavItem({
  link,
  active,
}: {
  link: (typeof navLinks)[number]
  active: boolean
}) {
  const className = cn(
    "relative rounded-full px-4 py-2 text-sm transition-colors",
    active ? "text-primary" : "text-muted-foreground hover:text-foreground",
  )

  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noreferrer noopener" className={className}>
        {link.label}
      </a>
    )
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
      {active && (
        <span className="absolute inset-x-4 -bottom-px h-px bg-primary" aria-hidden />
      )}
    </Link>
  )
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-72">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <nav className="mt-10 grid gap-1 px-4">
            {navLinks.map((link) => (
              <SheetClose asChild key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded-lg px-3 py-3 text-base text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base hover:bg-accent/50",
                      pathname === link.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </SheetClose>
            ))}
            <SheetClose asChild>
              <Button asChild className="mt-4">
                <Link href="/events">Join the Fest</Link>
              </Button>
            </SheetClose>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

/** Tracks whether the page has scrolled past the header's own height. */
function useScrolled(threshold = 16) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])

  return scrolled
}
