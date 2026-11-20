"use client"

import { useEffect, useState } from "react"

/**
 * The release sequence.
 *
 * Scripted beat by beat rather than driven by scroll or input: it plays once,
 * in front of a room, and the timing is the performance.
 *
 *   scout    a single small bug flies in out of the dark and settles
 *   perch    it sits on nothing, and the wordmark forms beneath it
 *   leave    it is startled off
 *   glitch   a huge bug arrives, tearing itself apart
 *   blind    it cuts out in hard blocks and the screen goes black
 *   return   it comes back dark, charges up, and its eye catches
 *   title    a flash hands over to CICADA 2026
 *
 * `onDone` fires at the end so the dashboard can take the film fullscreen.
 */

export type Beat = "scout" | "perch" | "leave" | "glitch" | "blind" | "return" | "title"

/** Milliseconds each beat holds. Tuned by eye; the whole run is ~16s. */
const BEATS: Array<[Beat, number]> = [
  ["scout", 3100],
  ["perch", 2300],
  ["leave", 1050],
  ["glitch", 2900],
  ["blind", 1300],
  ["return", 2400],
  ["title", 2600],
]

const BUG = "/brand/cicada-bug.svg"
const WORDMARK = "/brand/cicada-wordmark.svg"

export function Reveal({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const beat = BEATS[index]?.[0] ?? "title"

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      // No performance for anyone who has asked not to have one: hold the
      // title briefly, then hand over.
      setIndex(BEATS.length - 1)
      const id = setTimeout(onDone, 2200)
      return () => clearTimeout(id)
    }

    if (index >= BEATS.length) {
      onDone()
      return
    }
    const id = setTimeout(() => setIndex((current) => current + 1), BEATS[index][1])
    return () => clearTimeout(id)
  }, [index, onDone])

  // The wordmark is present from the perch onwards: the scout settles on a
  // mark that is not visible yet, and it draws in underneath it.
  const markVisible = index >= 1
  const bigBug = beat === "glitch" || beat === "blind" || beat === "return"

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black">
      {/* ---- the scout, and the mark it perches on ---- */}
      {index <= 2 && (
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-1/2 w-[min(78vw,1100px)] -translate-x-1/2 -translate-y-1/2">
            {markVisible && (
              <img
                src={WORDMARK}
                alt=""
                className="mark-form block w-full"
                style={{ animationDelay: "0ms" }}
              />
            )}
          </div>

          <img
            src={BUG}
            alt=""
            className={
              beat === "scout"
                ? "scout scout-in"
                : beat === "perch"
                  ? "scout scout-perch"
                  : "scout scout-out"
            }
          />
        </div>
      )}

      {/* ---- the big bug ---- */}
      {bigBug && (
        <div className="bigbug">
          <span
            className={
              beat === "glitch"
                ? "bigbug-in glitching"
                : beat === "blind"
                  ? "bigbug-in blinding"
                  : "bigbug-in returning"
            }
          >
            {/* Two offset colour ghosts behind the real thing make the tear
                read as a signal fault rather than a wobble. */}
            {beat === "glitch" && (
              <>
                <img src={BUG} alt="" className="ghost ga" style={{ filter: "hue-rotate(120deg) saturate(2)" }} />
                <img src={BUG} alt="" className="ghost gb" style={{ filter: "hue-rotate(-105deg) saturate(2)" }} />
              </>
            )}
            <img src={BUG} alt="" className="real" />
            {beat === "return" && <span className="eye" aria-hidden />}
          </span>
        </div>
      )}

      {/* ---- the flash into the title ---- */}
      {beat === "title" && <span className="whiteout" aria-hidden />}

      {/* ---- the title ---- */}
      {beat === "title" && (
        <div className="reveal-in absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
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
      )}
    </div>
  )
}
