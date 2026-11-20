"use client"

import { useEffect, useState } from "react"

import { WanderingBug } from "./bug"

/**
 * The standing display: intro, then one panel per event, looping forever.
 *
 * No controls. It is meant to be opened on a screen and left alone, so every
 * transition is on a timer and the cycle never ends.
 */

export type Panel = {
  slug: string
  title: string
  summary: string
  lead: string
  points: string[]
  poster: string | null
  date: string
  time: string
  teamSize: string
  fee: string
  mode: string
  soldOut: boolean
  prizes: Array<{ label: string; amount: string }>
}

const INTRO_MS = 5200
const PANEL_MS = 9000

export function LandingShow({ panels }: { panels: Panel[] }) {
  // -1 is the intro; 0.. are the event panels, looping.
  const [index, setIndex] = useState(-1)

  useEffect(() => {
    const hold = index < 0 ? INTRO_MS : PANEL_MS
    const id = setTimeout(() => {
      setIndex((current) => (current + 1) % panels.length)
    }, hold)
    return () => clearTimeout(id)
  }, [index, panels.length])

  const panel = index >= 0 ? panels[index] : null

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {/* ---- standing background ---- */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(60% 45% at 50% 0%, rgb(76 217 123 / 0.12), transparent 70%), radial-gradient(rgb(76 217 123 / 0.16) 1px, transparent 1.3px)",
          backgroundSize: "auto, 30px 30px",
        }}
        aria-hidden
      />

      <WanderingBug />

      {/* ---- the poster behind the current panel ---- */}
      {panels.map((item, i) => (
        <div
          key={item.slug}
          className="absolute inset-0 transition-opacity duration-[1400ms]"
          style={{ opacity: i === index && item.poster ? 1 : 0 }}
          aria-hidden
        >
          {item.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.poster}
              alt=""
              className="h-full w-full object-cover object-[center_22%] opacity-[0.18] blur-[2px]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/70" />
        </div>
      ))}

      {/* ---- intro ---- */}
      <section
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-1000 ${
          index < 0 ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/cicada-wordmark.svg" alt="CICADA" className="w-[min(72vw,900px)]" />
        <p className="mt-7 font-mono text-[0.8rem] uppercase tracking-[0.5em] text-primary md:text-base">
          2026
        </p>
        <p className="mt-9 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
          Atria Institute of Technology · Dept. of ISE
        </p>
        <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground/70 md:text-sm">
          19 – 21 November 2026 · Bengaluru
        </p>
      </section>

      {/* ---- event panels ---- */}
      {panels.map((item, i) => (
        <section
          key={item.slug}
          className={`absolute inset-0 z-30 flex flex-col justify-center px-[6vw] transition-all duration-1000 ${
            i === index
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-6 opacity-0"
          }`}
        >
          <div className="max-w-5xl">
            <p className="flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.34em] text-primary md:text-sm">
              <span className="h-px w-10 bg-primary" aria-hidden />
              Event {String(i + 1).padStart(2, "0")} of {String(panels.length).padStart(2, "0")}
              {item.soldOut && (
                <span className="rounded-full border border-amber-500/50 px-2.5 py-0.5 text-[0.62rem] text-amber-300">
                  Passes sold out
                </span>
              )}
            </p>

            <h2 className="announce-glow mt-4 font-display text-[clamp(2.2rem,6.2vw,5.2rem)] font-bold uppercase leading-[1.02] tracking-[0.01em]">
              {item.title}
            </h2>

            <p className="mt-5 max-w-3xl text-[clamp(1rem,1.5vw,1.45rem)] leading-relaxed text-foreground/90">
              {item.summary}
            </p>

            {item.lead && (
              <p className="mt-4 max-w-3xl text-[clamp(0.85rem,1.1vw,1.1rem)] leading-relaxed text-muted-foreground">
                {item.lead}
              </p>
            )}

            {item.points.length > 0 && (
              <ul className="mt-6 grid max-w-4xl gap-x-10 gap-y-2 sm:grid-cols-2">
                {item.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[clamp(0.8rem,1vw,1rem)] leading-snug text-foreground/85"
                  >
                    <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" aria-hidden />
                    {point}
                  </li>
                ))}
              </ul>
            )}

            {/* facts */}
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["Date", item.date],
                ["Time", item.time],
                ["Team", item.teamSize],
                ["Entry", item.fee],
                ["Mode", item.mode],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1.5 font-mono text-[clamp(0.85rem,1.1vw,1.15rem)] font-semibold text-primary">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            {item.prizes.length > 0 && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
                  Prizes
                </span>
                {item.prizes.map((prize) => (
                  <span
                    key={`${prize.label}-${prize.amount}`}
                    className="rounded-full border border-border bg-card/60 px-3.5 py-1.5 font-mono text-[clamp(0.7rem,0.9vw,0.9rem)]"
                  >
                    {prize.label} <b className="text-primary">{prize.amount}</b>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ---- standing chrome ---- */}
      <footer className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-between px-[6vw] pb-6 font-mono text-[0.62rem] uppercase tracking-[0.26em] text-muted-foreground md:text-[0.72rem]">
        <span>
          Cicada <span className="text-primary">2026</span> · 19 – 21 Nov
        </span>
        <span className="hidden sm:inline">cicada-2026.vercel.app</span>
        <span className="flex gap-2" aria-hidden>
          {panels.map((item, i) => (
            <i
              key={item.slug}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${
                i === index ? "bg-primary" : "bg-muted-foreground/25"
              }`}
            />
          ))}
        </span>
      </footer>

      {/* The bar that shows how long the current panel has left. */}
      <div className="absolute inset-x-0 bottom-0 z-40 h-[3px] bg-primary/10" aria-hidden>
        <div
          key={index}
          className="h-full bg-primary"
          style={{
            animation: `landing-progress ${index < 0 ? INTRO_MS : PANEL_MS}ms linear forwards`,
          }}
        />
      </div>
    </main>
  )
}
