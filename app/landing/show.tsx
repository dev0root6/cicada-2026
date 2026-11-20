"use client"

import { useEffect, useState } from "react"

import { WanderingBug } from "./bug"

/**
 * The standing display: intro, then one panel per event, looping forever.
 *
 * Dressed as the site itself — hairline grid, surface cards, HUD corners,
 * mono eyebrows — because it runs on a screen next to the site and the two
 * should read as one thing. Panels flip rather than fade: a fade reads as a
 * slideshow, a flip reads as a board turning over.
 *
 * No controls. Opened on a screen and left alone.
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

const INTRO_MS = 5600
const PANEL_MS = 9500

/** Where a panel sits relative to the one on screen. */
function flipClass(i: number, index: number): string {
  if (i === index) return "flip-on"
  // Panels already shown go one way, panels still to come the other, so the
  // cycle reads as a single continuous rotation rather than a shuffle.
  return i < index ? "flip-past" : "flip-next"
}

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

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {/* ---- the site's own backdrop ---- */}
      <div className="grid-backdrop absolute inset-0 opacity-[0.55]" aria-hidden />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(58% 42% at 50% 0%, rgb(76 217 123 / 0.14), transparent 72%), radial-gradient(rgb(76 217 123 / 0.14) 1px, transparent 1.3px)",
          backgroundSize: "auto, 30px 30px",
        }}
        aria-hidden
      />

      {/* The event's poster, far back and heavily knocked down. */}
      {panels.map((item, i) => (
        <div
          key={`bg-${item.slug}`}
          className="absolute inset-0 transition-opacity duration-[1600ms]"
          style={{ opacity: i === index && item.poster ? 1 : 0 }}
          aria-hidden
        >
          {item.poster && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.poster}
              alt=""
              className="h-full w-full scale-105 object-cover object-[center_22%] opacity-[0.16] blur-[3px]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/60" />
        </div>
      ))}

      <div className="crt-wash pointer-events-none absolute inset-0 z-10" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 44%, rgb(5 7 6 / 0.82) 100%)",
        }}
        aria-hidden
      />

      <WanderingBug />

      {/* ---- masthead, as on the site ---- */}
      <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border/70 bg-background/55 px-[4vw] py-4 backdrop-blur-sm">
        <span className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cicada-bug.svg" alt="" className="h-6 w-auto opacity-80" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cicada-wordmark.svg" alt="CICADA" className="h-5 w-auto md:h-6" />
          <span className="font-mono text-[0.6rem] tracking-[0.42em] text-muted-foreground md:text-[0.7rem]">
            2026
          </span>
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.26em] text-muted-foreground md:text-[0.7rem]">
          19 – 21 November · Atria Institute of Technology
        </span>
      </header>

      {/* ---- the flipping stage ---- */}
      <div className="flipstage absolute inset-x-0 bottom-[4.5rem] top-[4.5rem] z-30">
        {/* intro */}
        <section
          className={`flipcard absolute inset-0 flex flex-col items-center justify-center px-6 text-center ${
            index < 0 ? "flip-on" : "flip-past"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/cicada-wordmark.svg" alt="CICADA" className="w-[min(66vw,820px)]" />
          <p className="mt-6 font-mono text-[0.8rem] uppercase tracking-[0.52em] text-primary md:text-base">
            2026
          </p>
          <p className="mt-10 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground md:text-sm">
            Department of Information Science and Engineering
          </p>
          <p className="mt-2.5 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-muted-foreground/70 md:text-sm">
            Four events · Three days · Bengaluru
          </p>
        </section>

        {/* one card per event */}
        {panels.map((item, i) => (
          <section
            key={item.slug}
            className={`flipcard absolute inset-0 flex items-center px-[4vw] ${flipClass(i, index)}`}
          >
            <div className="hud-corners surface grid w-full gap-8 overflow-hidden p-[clamp(1.1rem,2.4vw,2.6rem)] lg:grid-cols-[1.45fr_1fr] lg:gap-10">
              {/* copy */}
              <div className="min-w-0">
                <p className="eyebrow flex flex-wrap items-center gap-3">
                  {item.title.split(":")[0]}
                  <span className="text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
                  </span>
                  {item.soldOut && (
                    <span className="rounded-full border border-amber-500/50 px-2.5 py-0.5 text-[0.62rem] tracking-[0.2em] text-amber-300">
                      Passes sold out
                    </span>
                  )}
                </p>

                <h2 className="announce-glow mt-3 font-display text-[clamp(1.6rem,3.6vw,3.3rem)] font-bold uppercase leading-[1.04] tracking-[0.01em]">
                  {item.title}
                </h2>

                <p className="mt-4 max-w-2xl text-[clamp(0.9rem,1.25vw,1.25rem)] leading-relaxed text-foreground/90">
                  {item.summary}
                </p>

                {item.lead && (
                  <p className="mt-3 max-w-2xl text-[clamp(0.78rem,0.95vw,1rem)] leading-relaxed text-muted-foreground">
                    {item.lead}
                  </p>
                )}

                {item.points.length > 0 && (
                  <ul className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {item.points.slice(0, 4).map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 text-[clamp(0.72rem,0.9vw,0.95rem)] leading-snug text-foreground/85"
                      >
                        <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" aria-hidden />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {item.prizes.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-[0.58rem] uppercase tracking-[0.24em] text-muted-foreground">
                      Prizes
                    </span>
                    {item.prizes.map((prize) => (
                      <span
                        key={`${prize.label}-${prize.amount}`}
                        className="rounded-full border border-border bg-background/60 px-3 py-1.5 font-mono text-[clamp(0.65rem,0.82vw,0.85rem)]"
                      >
                        {prize.label} <b className="text-primary">{prize.amount}</b>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* poster + facts, the site's sidebar rail */}
              <div className="flex min-w-0 flex-col gap-4">
                {item.poster && (
                  <div className="relative overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.poster}
                      alt=""
                      className="h-[clamp(7rem,17vh,13rem)] w-full object-cover object-[center_22%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  </div>
                )}

                <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background/40">
                  {[
                    ["Date", item.date],
                    ["Time", item.time],
                    ["Team", item.teamSize],
                    ["Entry", item.fee],
                    ["Mode", item.mode],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-baseline justify-between gap-4 px-4 py-[clamp(0.3rem,0.75vh,0.65rem)]"
                    >
                      <dt className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="text-right font-mono text-[clamp(0.68rem,0.85vw,0.9rem)] font-semibold text-primary">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ---- standing chrome ---- */}
      <footer className="absolute inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-border/70 bg-background/55 px-[4vw] pb-4 pt-3 font-mono text-[0.58rem] uppercase tracking-[0.26em] text-muted-foreground backdrop-blur-sm md:text-[0.68rem]">
        <span>
          Cicada <span className="text-primary">2026</span>
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
