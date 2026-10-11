"use client"

import { useEffect, useRef } from "react"

/**
 * The entity: a bright yellow orb, the same light as the bug's voice orb in the
 * reels: a white-hot core, a wide glow, rays sweeping round and a ring that
 * pulses as if it's talking. It wanders inside its frame and never sits still.
 * `dead` is how it looks once someone has shut it down.
 */
export function EntityOrb({ size = 220, dead = false, className }: { size?: number; dead?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const BARS = 72
    const bars = new Float32Array(BARS)
    let raf = 0
    const t0 = performance.now()

    const draw = (now: number) => {
      const t = still ? 1.2 : (now - t0) / 1000
      const r0 = size * 0.075
      // wander: a slow loop around the centre, plus a little breathing
      const cx = size / 2 + (dead || still ? 0 : Math.sin(t * 0.7) * size * 0.06 + Math.sin(t * 1.9) * size * 0.015)
      const cy = size / 2 + (dead || still ? 0 : Math.cos(t * 0.53) * size * 0.05)
      const level = dead ? 0 : 0.35 + 0.35 * Math.abs(Math.sin(t * 2.3) * Math.sin(t * 0.9 + 1)) + 0.15 * Math.random()
      const r = r0 * (1 + level * 0.3)
      ctx.clearRect(0, 0, size, size)

      if (dead) {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r0 * 1.4)
        g.addColorStop(0, "rgba(150,150,160,.55)")
        g.addColorStop(1, "rgba(80,80,90,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, r0 * 1.4, 0, Math.PI * 2)
        ctx.fill()
        return
      }

      // halo
      // everything stays inside the canvas, so no square edge ever shows
      const edge = size / 2 - Math.max(Math.abs(cx - size / 2), Math.abs(cy - size / 2)) - 2
      const hr = Math.min(r * 6, edge)
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, hr)
      halo.addColorStop(0, "rgba(255,248,215,.6)")
      halo.addColorStop(0.22, "rgba(255,210,63,.36)")
      halo.addColorStop(1, "rgba(255,190,40,0)")
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, hr, 0, Math.PI * 2)
      ctx.fill()

      // pulsing ring of light, like a voice meter
      ctx.save()
      ctx.translate(cx, cy)
      ctx.lineCap = "round"
      ctx.lineWidth = Math.max(1.4, r0 * 0.09)
      for (let i = 0; i < BARS; i++) {
        const v = level * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.9 + t * 6) * Math.cos(i * 0.37 - t * 3.1)))
        bars[i] += (v - bars[i]) * 0.3
        const a = (i / BARS) * Math.PI * 2 - Math.PI / 2
        const br = r0 * 2.1
        const len = 2 + bars[i] * r0 * 2
        ctx.strokeStyle = `rgba(255,226,130,${0.3 + 0.55 * bars[i]})`
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * br, Math.sin(a) * br)
        ctx.lineTo(Math.cos(a) * (br + len), Math.sin(a) * (br + len))
        ctx.stroke()
      }

      // rays sweeping round
      for (let i = 0; i < 12; i++) {
        ctx.save()
        ctx.rotate((i / 12) * Math.PI * 2 + t * 0.25)
        const len = Math.min(edge, r * (3.4 + 1.5 * Math.sin(t * 4 + i) + level * 2.4))
        const ray = ctx.createLinearGradient(0, 0, len, 0)
        ray.addColorStop(0, "rgba(255,250,225,.42)")
        ray.addColorStop(1, "rgba(255,210,63,0)")
        ctx.fillStyle = ray
        ctx.beginPath()
        ctx.moveTo(0, -r * 0.13)
        ctx.lineTo(len, 0)
        ctx.lineTo(0, r * 0.13)
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()

      // white-hot core
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
      core.addColorStop(0, "rgba(255,255,255,1)")
      core.addColorStop(0.5, "rgba(255,250,222,1)")
      core.addColorStop(0.78, "rgba(255,218,90,.9)")
      core.addColorStop(1, "rgba(255,200,50,0)")
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fill()

      if (!still) raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [size, dead])

  return <canvas ref={ref} aria-hidden className={className} style={{ width: size, height: size }} />
}
