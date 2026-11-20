"use client"

import { useEffect, useRef } from "react"

/**
 * A cicada that flies its own path and leaves a trail behind it.
 *
 * Deliberately not pointer-driven: this screen is left running with nobody
 * touching it, so the bug has to be alive on its own. The path is a sum of
 * sines at unrelated frequencies, which wanders without ever repeating on a
 * timescale anyone will sit and watch.
 *
 * The trail is a canvas painted with a translucent black rectangle each frame
 * rather than a list of elements: fading hundreds of DOM nodes is what would
 * actually cost something here.
 */

const BUG = "/brand/cicada-bug.svg"

/** Unrelated frequencies, so the path never settles into a visible loop. */
const WX = [0.00021, 0.00037, 0.00013]
const WY = [0.00029, 0.00017, 0.00041]

export function WanderingBug() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bugRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const bug = bugRef.current
    if (!canvas || !bug) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) {
      bug.style.opacity = "0.5"
      return
    }

    const context = canvas.getContext("2d")
    if (!context) return

    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    // Phase offsets keep the two axes from sharing a rhythm.
    const px = [Math.random() * 99, Math.random() * 99, Math.random() * 99]
    const py = [Math.random() * 99, Math.random() * 99, Math.random() * 99]

    const position = (t: number) => {
      // Each axis is three sines; the result is kept inside a margin so the
      // bug never parks itself half off-screen.
      const sx =
        0.5 +
        0.3 * Math.sin(t * WX[0] + px[0]) +
        0.12 * Math.sin(t * WX[1] + px[1]) +
        0.06 * Math.sin(t * WX[2] + px[2])
      const sy =
        0.5 +
        0.28 * Math.sin(t * WY[0] + py[0]) +
        0.13 * Math.sin(t * WY[1] + py[1]) +
        0.05 * Math.sin(t * WY[2] + py[2])
      return { x: sx * width, y: sy * height }
    }

    let raf = 0
    let last = position(0)

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return

      // Fade what is already drawn instead of clearing: that is the trail.
      context.globalCompositeOperation = "destination-out"
      context.fillStyle = "rgba(0,0,0,0.045)"
      context.fillRect(0, 0, width, height)
      context.globalCompositeOperation = "source-over"

      const p = position(now)

      context.strokeStyle = "rgba(76,217,123,0.5)"
      context.lineWidth = 2.2
      context.lineCap = "round"
      context.beginPath()
      context.moveTo(last.x, last.y)
      context.lineTo(p.x, p.y)
      context.stroke()

      // A brighter, shorter core inside the trail gives it depth.
      context.strokeStyle = "rgba(190,255,214,0.5)"
      context.lineWidth = 0.9
      context.stroke()

      const angle = Math.atan2(p.y - last.y, p.x - last.x)
      bug.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) rotate(${angle + Math.PI / 2}rad)`

      last = p
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />
      <img
        ref={bugRef}
        src={BUG}
        alt=""
        className="absolute left-0 top-0 w-[clamp(44px,4.4vw,80px)] opacity-80 drop-shadow-[0_0_18px_rgba(76,217,123,0.6)]"
      />
    </div>
  )
}
