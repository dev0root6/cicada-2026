"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

type Detach = (() => void) & { refresh?: () => void }

declare global {
  interface Window {
    CicadaFly?: { attach: (home: Element | (() => Element | null)) => Detach }
    CicadaCursor?: { attach: (options: { grid?: string }) => () => void }
    CicadaGames?: { attach: () => void; open: () => void }
  }
}

/** Loads a script once; resolves immediately if its global is already there. */
function load(src: string, ready: () => boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    if (ready()) return resolve()
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    const script = existing ?? document.createElement("script")
    script.addEventListener("load", () => resolve(), { once: true })
    script.addEventListener("error", () => reject(new Error(src)), { once: true })
    if (!existing) {
      script.src = src
      script.async = true
      document.head.appendChild(script)
    }
  })
}

/**
 * Where the bug lives when it isn't flying: the /home hero bug while it's on
 * screen, otherwise the navbar logo (always visible — the header is sticky).
 */
function currentHome(): Element | null {
  const hero = document.querySelector('[data-cicada-home="hero"]')
  if (hero) {
    const r = hero.getBoundingClientRect()
    if (r.width && r.bottom > 0 && r.top < window.innerHeight) return hero
  }
  return document.querySelector('[data-cicada-home="logo"]')
}

/**
 * Site-wide interactive layer, mounted once in the (site) layout so it
 * survives client-side navigation: the custom cursor with grid trails, the
 * flying bug, and the games you can play with it (desktop). The effects themselves are plain scripts in public/brand, shared
 * with the teaser at "/".
 */
export function SiteEffects() {
  const pathname = usePathname()
  const fly = useRef<Detach | null>(null)

  useEffect(() => {
    let cancelled = false
    let detachCursor: (() => void) | undefined

    // Give the /home hero's entrance a moment before the bug can leave it.
    const delay = window.location.pathname === "/home" ? 1000 : 250
    const timer = window.setTimeout(() => {
      Promise.all([
        load("/brand/cicada-cursor.js", () => Boolean(window.CicadaCursor)),
        load("/brand/cicada-fly.js", () => Boolean(window.CicadaFly)),
        load("/brand/cicada-games.js", () => Boolean(window.CicadaGames)),
      ])
        .then(() => {
          if (cancelled) return
          detachCursor = window.CicadaCursor?.attach({ grid: ".heist-grid" })
          fly.current = window.CicadaFly?.attach(currentHome) ?? null
          // Desktop only; offers the bug games after sustained restless movement.
          window.CicadaGames?.attach()
        })
        .catch(() => {})
    }, delay)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      detachCursor?.()
      fly.current?.()
      fly.current = null
    }
  }, [])

  // New page, new home element for the bug to fade out of or dock onto.
  useEffect(() => {
    fly.current?.refresh?.()
  }, [pathname])

  return null
}
