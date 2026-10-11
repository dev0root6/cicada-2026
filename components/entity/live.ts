"use client"

import { useEffect, useState } from "react"

/**
 * Whether the entity has been destroyed, kept current by polling the status
 * endpoint, so every open page flips within a few seconds of someone winning.
 */
export function useEntityStatus(initial: boolean, everyMs = 4000): boolean {
  const [destroyed, setDestroyed] = useState(initial)
  useEffect(() => {
    if (destroyed) return
    let stop = false
    const check = async () => {
      try {
        const res = await fetch("/api/entity", { cache: "no-store" })
        if (!res.ok) return
        const data = (await res.json()) as { destroyed?: boolean }
        if (!stop && data.destroyed) setDestroyed(true)
      } catch {
        // offline for a moment; try again on the next tick
      }
    }
    const id = setInterval(check, everyMs)
    const onFocus = () => void check()
    window.addEventListener("focus", onFocus)
    return () => {
      stop = true
      clearInterval(id)
      window.removeEventListener("focus", onFocus)
    }
  }, [destroyed, everyMs])
  return destroyed
}
