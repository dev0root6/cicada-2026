"use client"

import { useEffect, useRef } from "react"
import { BUG_SRC } from "@/components/brand/logo"

declare global {
  interface Window {
    CicadaFly?: { attach: (home: Element) => () => void }
  }
}

const SCRIPT_SRC = "/brand/cicada-fly.js"

/** Loads the shared flight script once per page load. */
function loadFlight(): Promise<void> {
  if (window.CicadaFly) return Promise.resolve()
  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
    if (!script) {
      script = document.createElement("script")
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }
    script.addEventListener("load", () => resolve(), { once: true })
    script.addEventListener("error", () => reject(), { once: true })
  })
}

/**
 * The hero bug. Once its entrance animation has played it can take off:
 * following the cursor on desktop, flying to taps on touch screens. The flight
 * itself lives in public/brand/cicada-fly.js, shared with the teaser at "/".
 */
export function FlyingBug({ className, delayMs = 1000 }: { className?: string; delayMs?: number }) {
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let detach: (() => void) | undefined
    let cancelled = false

    const timer = window.setTimeout(() => {
      loadFlight()
        .then(() => {
          if (!cancelled && ref.current && window.CicadaFly) {
            detach = window.CicadaFly.attach(ref.current)
          }
        })
        .catch(() => {})
    }, delayMs)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      detach?.()
    }
  }, [delayMs])

  return <img ref={ref} src={BUG_SRC} alt="" aria-hidden className={className} />
}
