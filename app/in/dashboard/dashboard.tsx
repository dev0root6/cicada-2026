"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Maximize2 } from "lucide-react"

import { inaugurationFilm } from "@/data/inauguration"
import type { CeremonyState } from "@/lib/inauguration/shared"
import { cn } from "@/lib/utils"

/**
 * The reveal screen, for the projector.
 *
 * Three states, in order:
 *
 *  1. **Standby** — one lamp per chief guest, lighting as each presses. No
 *     counters and no copy: nothing on screen should explain the trick to the
 *     room before it happens.
 *  2. **Title** — the wordmark lands the moment the last guest presses, and
 *     holds for a few seconds so the room can react.
 *  3. **Film** — the player then takes the entire viewport, edge to edge.
 *
 * Real browser fullscreen can only be requested from a user gesture, so it
 * cannot be triggered by the reveal itself. The "Arm projector" button exists
 * for that: one click before the ceremony puts the page into fullscreen and
 * unlocks audio, and the reveal is then already running edge to edge.
 */

const POLL_MS = 1200

/** How long the wordmark holds before the film takes over. */
const TITLE_HOLD_MS = 3400

const FILM = inaugurationFilm.src
const YOUTUBE = inaugurationFilm.youtubeId

export function Dashboard({ initial }: { initial: CeremonyState }) {
  const [state, setState] = useState<CeremonyState>(initial)
  const [revealed, setRevealed] = useState(initial.released)
  const [stage, setStage] = useState<"title" | "film">("title")
  const [hasFilm, setHasFilm] = useState(false)
  const [armed, setArmed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const filmRef = useRef<HTMLElement>(null)

  const showFilm = Boolean((FILM && hasFilm) || (!FILM && YOUTUBE))

  /* ---- live state ------------------------------------------------------ */

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

  /* ---- is there actually a film? --------------------------------------- */

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

  /* ---- title, then film ------------------------------------------------ */

  useEffect(() => {
    if (!revealed || !showFilm) return
    const id = setTimeout(() => setStage("film"), TITLE_HOLD_MS)
    return () => clearTimeout(id)
  }, [revealed, showFilm])

  // Self-hosted file: try with sound, fall back to muted rather than not play.
  useEffect(() => {
    if (stage !== "film" || !FILM) return
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {
      video.muted = true
      void video.play().catch(() => undefined)
    })
  }, [stage])

  /**
   * Put the player itself into fullscreen as it appears.
   *
   * Browsers refuse a fullscreen request that has no user gesture behind it —
   * except when the document is already fullscreen, where moving fullscreen to
   * a descendant is allowed. That is exactly the case after "Arm projector",
   * which is why arming matters. Unarmed, this throws and is swallowed: the
   * film still covers the viewport through CSS, so the room sees the same
   * thing either way.
   */
  useEffect(() => {
    if (stage !== "film") return
    const target = filmRef.current
    if (!target) return
    const id = setTimeout(() => {
      if (document.fullscreenElement === target) return
      void target.requestFullscreen?.().catch(() => undefined)
    }, 80)
    return () => clearTimeout(id)
  }, [stage])

  /* ---- fullscreen ------------------------------------------------------ */

  // Track fullscreen rather than assume it: Esc or F11 can drop out of it.
  useEffect(() => {
    const sync = () => setArmed(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", sync)
    return () => document.removeEventListener("fullscreenchange", sync)
  }, [])

  const arm = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen?.()
    } catch {
      // Refused, or the browser has no Fullscreen API. The ceremony still
      // works — the operator can press F11 instead.
    }
    setArmed(true)
    // A click is also the gesture that lets audio start later, so warm the
    // self-hosted player up here while the room is still filling.
    const video = videoRef.current
    if (video) {
      try {
        await video.play()
        video.pause()
        video.currentTime = 0
      } catch {
        /* nothing to warm up yet */
      }
    }
  }, [])

  /* ---- 3. film, edge to edge ------------------------------------------- */

  if (revealed && stage === "film" && showFilm) {
    return (
      <main ref={filmRef} className="fixed inset-0 z-50 bg-black">
        {FILM ? (
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            src={FILM}
            playsInline
            autoPlay
            controls
          />
        ) : (
          <iframe
            className="h-full w-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${YOUTUBE}?autoplay=1&rel=0&modestbranding=1&playsinline=1&fs=1&start=${inaugurationFilm.startAt}`}
            title="CICADA 2026 inauguration film"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        )}
      </main>
    )
  }

  /* ---- 2. the title ----------------------------------------------------- */

  if (revealed) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center overflow-hidden px-6">
        <div className="reveal-in flex w-full max-w-6xl flex-col items-center text-center">
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.42em] text-primary md:text-sm">
            Atria Institute of Technology presents
          </p>

          <h1 className="announce-glow mt-6 font-display text-[clamp(3.5rem,16vw,11rem)] font-bold uppercase leading-[0.95] tracking-[0.02em]">
            CICADA <span className="text-primary">2026</span>
          </h1>

          <p className="mt-4 font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground md:text-base">
            Declared open · 19 – 21 November 2026
          </p>
        </div>
      </main>
    )
  }

  /* ---- 1. standby ------------------------------------------------------- */

  return (
    <main className="flex h-dvh flex-col items-center justify-center px-6">
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

      {/* The one control on this screen, and only until it has been used.
          Clicking it is what makes the reveal fullscreen and lets it have
          sound — both need a real gesture, which the reveal itself is not. */}
      {!armed && (
        <button
          type="button"
          onClick={() => void arm()}
          className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/70 backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden />
          Arm projector
        </button>
      )}

      {/* Warms the self-hosted player up on the arming click. */}
      {FILM && hasFilm && <video ref={videoRef} src={FILM} className="hidden" preload="auto" />}
    </main>
  )
}
