"use client"

import { useEffect, useRef } from "react"

/**
 * A cicada that flies its own path, flapping, leaving a trail.
 *
 * Built from the three brand layers — left wing, body, right wing — in a
 * perspective rig, so each wing actually swings about its hinge in 3D rather
 * than the whole bug being a flat picture that slides around. The hinge
 * fractions and the perspective match public/brand/cicada-fly.js, which is
 * where this rig comes from.
 *
 * Deliberately not pointer-driven: the screen is left running with nobody
 * touching it, so the bug has to be alive on its own. Its path is a sum of
 * sines at unrelated frequencies — it wanders without ever repeating on a
 * timescale anyone will sit and watch.
 *
 * The trail is a canvas faded a little each frame, not a pile of elements.
 */

const BASE = "/brand/cicada-bug-"
const HINGE_L = "36.6% 42%"
const HINGE_R = "62% 42%"

/** Unrelated frequencies, so the path never settles into a visible loop. */
const WX = [0.000195, 0.00036, 0.000125]
const WY = [0.000275, 0.000165, 0.00039]

/** Wingbeats per second at rest. A real cicada is far faster; this reads. */
const FLAP_HZ = 7.5

export function WanderingBug() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const flyerRef = useRef<HTMLDivElement>(null)
  const rigRef = useRef<HTMLDivElement>(null)
  const wingLRef = useRef<HTMLImageElement>(null)
  const wingRRef = useRef<HTMLImageElement>(null)
  const ghostLRef = useRef<HTMLImageElement>(null)
  const ghostRRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const flyer = flyerRef.current
    const rig = rigRef.current
    const wingL = wingLRef.current
    const wingR = wingRRef.current
    const ghostL = ghostLRef.current
    const ghostR = ghostRRef.current
    if (!canvas || !flyer || !rig || !wingL || !wingR || !ghostL || !ghostR) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flyer.style.opacity = "0.55"
      return
    }

    const context = canvas.getContext("2d")
    if (!context) return

    let width = 0
    let height = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
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
      const sx =
        0.5 +
        0.3 * Math.sin(t * WX[0] + px[0]) +
        0.12 * Math.sin(t * WX[1] + px[1]) +
        0.06 * Math.sin(t * WX[2] + px[2])
      const sy =
        0.5 +
        0.27 * Math.sin(t * WY[0] + py[0]) +
        0.13 * Math.sin(t * WY[1] + py[1]) +
        0.05 * Math.sin(t * WY[2] + py[2])
      return { x: sx * width, y: sy * height }
    }

    let raf = 0
    let previous = position(0)
    let last = performance.now()
    let heading = 0
    let flap = 0

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (document.hidden) return

      // Fade what is already drawn instead of clearing: that is the trail.
      context.globalCompositeOperation = "destination-out"
      context.fillStyle = "rgba(0,0,0,0.05)"
      context.fillRect(0, 0, width, height)
      context.globalCompositeOperation = "source-over"

      const p = position(now)
      const dx = p.x - previous.x
      const dy = p.y - previous.y
      const speed = Math.hypot(dx, dy) / Math.max(dt, 0.001)

      context.strokeStyle = "rgba(76,217,123,0.45)"
      context.lineWidth = 2.2
      context.lineCap = "round"
      context.beginPath()
      context.moveTo(previous.x, previous.y)
      context.lineTo(p.x, p.y)
      context.stroke()
      context.strokeStyle = "rgba(190,255,214,0.45)"
      context.lineWidth = 0.9
      context.stroke()

      // Turn towards travel rather than snapping: a real insect banks.
      const target = Math.atan2(dy, dx) + Math.PI / 2
      const delta = ((target - heading + Math.PI * 3) % (Math.PI * 2)) - Math.PI
      heading += delta * Math.min(1, dt * 3.2)

      // Beating faster when working harder, and a touch of bob from the beat.
      flap += dt * Math.PI * 2 * (FLAP_HZ + Math.min(speed, 260) / 95)
      const beat = Math.sin(flap)
      const bob = beat * 1.6

      flyer.style.transform =
        `translate(${p.x.toFixed(1)}px, ${(p.y + bob).toFixed(1)}px) ` +
        `translate(-50%, -50%) rotate(${heading.toFixed(3)}rad)`

      // The downstroke sweeps further than the upstroke, as a wing does.
      const angle = beat > 0 ? beat * 62 : beat * 44
      wingL.style.transform = `rotateY(${angle.toFixed(1)}deg)`
      wingR.style.transform = `rotateY(${(-angle).toFixed(1)}deg)`

      // Edge-on wings catch less light.
      const shade = (0.55 + 0.45 * (1 - Math.abs(beat))).toFixed(2)
      wingL.style.opacity = shade
      wingR.style.opacity = shade

      // Ghosts lag by a fraction of a beat: that smear is what sells speed.
      const lag = Math.sin(flap - 0.75)
      const lagAngle = lag > 0 ? lag * 62 : lag * 44
      ghostL.style.transform = `rotateY(${lagAngle.toFixed(1)}deg)`
      ghostR.style.transform = `rotateY(${(-lagAngle).toFixed(1)}deg)`
      const smear = (0.16 * Math.abs(beat)).toFixed(2)
      ghostL.style.opacity = smear
      ghostR.style.opacity = smear

      previous = p
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  const part = "absolute inset-0 h-full w-full select-none"

  return (
    <div className="pointer-events-none fixed inset-0 z-20" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0 opacity-70" />

      <div
        ref={flyerRef}
        className="absolute left-0 top-0 w-[clamp(74px,7vw,132px)] will-change-transform"
        style={{ aspectRatio: "213 / 88" }}
      >
        {/* Glow first, so it sits behind the layers. */}
        <div
          className="absolute -inset-x-[10%] -inset-y-[30%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(76,217,123,0.30), transparent 70%)",
          }}
        />
        <div ref={rigRef} className="absolute inset-0" style={{ perspective: "240px" }}>
          {/* eslint-disable @next/next/no-img-element */}
          <img ref={ghostLRef} src={`${BASE}wing-left.svg`} alt="" className={part} style={{ transformOrigin: HINGE_L, opacity: 0 }} />
          <img ref={ghostRRef} src={`${BASE}wing-right.svg`} alt="" className={part} style={{ transformOrigin: HINGE_R, opacity: 0 }} />
          <img ref={wingLRef} src={`${BASE}wing-left.svg`} alt="" className={part} style={{ transformOrigin: HINGE_L }} />
          <img ref={wingRRef} src={`${BASE}wing-right.svg`} alt="" className={part} style={{ transformOrigin: HINGE_R }} />
          <img src={`${BASE}body.svg`} alt="" className={part} />
          {/* eslint-enable @next/next/no-img-element */}
        </div>
      </div>
    </div>
  )
}
