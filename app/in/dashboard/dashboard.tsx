"use client"

import { useEffect, useRef, useState } from "react"

import { inaugurationFilm } from "@/data/inauguration"
import type { CeremonyState } from "@/lib/inauguration/shared"
import { cn } from "@/lib/utils"

/**
 * The reveal screen, for the projector.
 *
 * Deliberately almost empty before the release: a row of lamps, one per chief
 * guest, lighting up as each presses. No counters, no copy, nothing that
 * explains the trick to the room. When the last lamp lights, the wordmark
 * lands and the film rolls.
 */

const POLL_MS = 1200

const FILM = inaugurationFilm.src
const YOUTUBE = inaugurationFilm.youtubeId

export function Dashboard({ initial }: { initial: CeremonyState }) {
  const [state, setState] = useState<CeremonyState>(initial)
  const [revealed, setRevealed] = useState(initial.released)
  const [hasFilm, setHasFilm] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Poll until released, then stop — nothing after the reveal depends on it.
  useEffect(() => {
    if (revealed) return
    let alive = true
    const tick = async () => {
      try {
        const res = await fetch("/api/inauguration/state", { cache: "no-store" })
        if (!res.ok) return
        const next = (await res.json()) as CeremonyState
        if (!alive) return
        setState(next)
        if (next.released) setRevealed(true)
      } catch {
        /* keep the last good state */
      }
    }
    const id = setInterval(tick, POLL_MS)
    void tick()
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [revealed])

  // Only show the player if the film has actually been uploaded, so the screen
  // never shows a broken video box in front of an audience. A YouTube embed
  // can't be probed this way, so it is simply trusted.
  useEffect(() => {
    if (!FILM) return
    let alive = true
    fetch(FILM, { method: "HEAD" })
      .then((res) => {
        if (alive) setHasFilm(res.ok)
      })
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  // Try to play with sound the moment we reveal; fall back to muted if the
  // browser refuses, so the film rolls either way.
  useEffect(() => {
    if (!revealed || !hasFilm || !FILM) return
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {
      video.muted = true
      void video.play().catch(() => undefined)
    })
  }, [revealed, hasFilm])

  // Whether a player will actually appear, so the heading can make room.
  const showFilm = Boolean((FILM && hasFilm) || (!FILM && YOUTUBE))

  if (revealed) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center overflow-hidden px-6 py-6">
        <div className="reveal-in flex w-full max-w-6xl flex-col items-center">
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.42em] text-primary md:text-sm">
            Atria Institute of Technology presents
          </p>

          <h1
            className={cn(
              "announce-glow font-display font-bold uppercase leading-[0.95] tracking-[0.02em]",
              showFilm
                ? "mt-4 text-[clamp(2.25rem,7vw,5rem)]"
                : "mt-6 text-[clamp(3.5rem,16vw,11rem)]",
            )}
          >
            CICADA <span className="text-primary">2026</span>
          </h1>

          <p
            className={cn(
              "font-mono uppercase tracking-[0.3em] text-muted-foreground",
              showFilm ? "mt-2 text-xs md:text-sm" : "mt-4 text-sm md:text-base",
            )}
          >
            Declared open · 19 – 21 November 2026
          </p>

          {FILM && hasFilm && (
            <video
              ref={videoRef}
              className="mt-5 max-h-[58dvh] w-full max-w-5xl rounded-xl border border-primary/25"
              src={FILM}
              playsInline
              controls
              autoPlay
            />
          )}

          {!FILM && YOUTUBE && (
            <div className="mt-5 aspect-video max-h-[58dvh] w-full max-w-5xl overflow-hidden rounded-xl border border-primary/25">
              {/* rel=0 keeps the end screen to this channel; modestbranding and
                  playsinline keep the frame as plain as YouTube allows. */}
              <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${YOUTUBE}?autoplay=1&rel=0&modestbranding=1&playsinline=1&start=${inaugurationFilm.startAt}`}
                title="CICADA 2026 inauguration film"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </main>
    )
  }

  // ---- before the release: lamps only ----
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="flex flex-wrap items-center justify-center gap-6 md:gap-9">
        {state.guests.map((guest) => (
          <span
            key={guest.id}
            title={guest.label}
            className={cn(
              "h-5 w-5 rounded-full transition-all duration-700 md:h-7 md:w-7",
              guest.pressedAt
                ? "bg-primary shadow-[0_0_34px_8px_rgb(76_217_123/0.55)]"
                : "bg-muted-foreground/20",
            )}
          />
        ))}
      </div>

      {state.guests.length === 0 && (
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground/50">
          Standing by
        </p>
      )}
    </main>
  )
}
