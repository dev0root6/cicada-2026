"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Maximize2, Volume2, VolumeX } from "lucide-react"

const SRC = "/up/inaug-video.mp4"

/**
 * Looping player for the inauguration reel.
 *
 * Starts muted on purpose: browsers refuse to autoplay anything with sound,
 * and a reel that silently fails to start is worse than one that starts
 * silent. The unmute button is the first thing on the controls bar.
 *
 * The controls fade out while the pointer is still, so the screen is clean
 * when it is left running in a hall.
 */
export function InaugVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [muted, setMuted] = useState(true)
  const [idle, setIdle] = useState(false)

  // Hide the chrome after a few seconds of stillness; any movement brings it back.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const wake = () => {
      setIdle(false)
      clearTimeout(timer)
      timer = setTimeout(() => setIdle(true), 2600)
    }
    wake()
    window.addEventListener("pointermove", wake)
    window.addEventListener("keydown", wake)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("pointermove", wake)
      window.removeEventListener("keydown", wake)
    }
  }, [])

  function toggleSound() {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
    // Unmuting counts as the gesture autoplay was waiting for.
    if (!video.muted) void video.play().catch(() => undefined)
  }

  function goFullscreen() {
    void wrapRef.current?.requestFullscreen?.().catch(() => undefined)
  }

  return (
    <div
      ref={wrapRef}
      className="relative flex min-h-dvh flex-col items-center justify-center bg-black"
    >
      <video
        ref={videoRef}
        className="h-dvh w-full object-contain"
        src={SRC}
        poster="/up/inaug-video-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />

      <div
        className={
          idle
            ? "pointer-events-none absolute bottom-6 flex gap-3 opacity-0 transition-opacity duration-500"
            : "absolute bottom-6 flex gap-3 opacity-100 transition-opacity duration-300"
        }
      >
        <button
          type="button"
          onClick={toggleSound}
          className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-black/70 px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary backdrop-blur transition-colors hover:border-primary"
          aria-pressed={!muted}
        >
          {muted ? (
            <VolumeX className="h-4 w-4" aria-hidden />
          ) : (
            <Volume2 className="h-4 w-4" aria-hidden />
          )}
          {muted ? "Sound off" : "Sound on"}
        </button>

        <button
          type="button"
          onClick={goFullscreen}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-black/70 px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Maximize2 className="h-4 w-4" aria-hidden />
          Fullscreen
        </button>

        <a
          href={SRC}
          download="CICADA-2026-Inauguration.mp4"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-black/70 px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download
        </a>
      </div>
    </div>
  )
}
