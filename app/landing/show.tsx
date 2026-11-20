"use client"

import { WanderingBug } from "./bug"

/**
 * The standing display: CICADA, and a cicada flying across it.
 *
 * No slideshow, no panels, no controls — it is the mark on the wall. Dressed
 * in the site's own backdrop so a screen running this and a screen showing
 * the site read as one thing.
 */
export function LandingShow() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-background">
      {/* ---- the site's own backdrop ---- */}
      <div className="grid-backdrop absolute inset-0 opacity-[0.5]" aria-hidden />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(58% 44% at 50% 38%, rgb(76 217 123 / 0.16), transparent 72%), radial-gradient(rgb(76 217 123 / 0.14) 1px, transparent 1.3px)",
          backgroundSize: "auto, 30px 30px",
        }}
        aria-hidden
      />
      <div className="crt-wash pointer-events-none absolute inset-0 z-10" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgb(5 7 6 / 0.86) 100%)",
        }}
        aria-hidden
      />

      <WanderingBug />

      {/* ---- the mark ---- */}
      <section className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
        {/* The host, above the fest's own mark and kept quieter than it. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/atria-white.png"
          alt="Atria Institute of Technology"
          className="mb-9 w-[min(34vw,330px)] opacity-90"
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/cicada-wordmark.svg"
          alt="CICADA"
          className="w-[min(70vw,880px)] drop-shadow-[0_0_80px_rgba(76,217,123,0.28)]"
        />
        <p className="mt-7 font-mono text-[clamp(0.75rem,1.1vw,1.1rem)] uppercase tracking-[0.55em] text-primary">
          2026
        </p>
        <p className="mt-10 font-mono text-[clamp(0.6rem,0.78vw,0.8rem)] uppercase tracking-[0.3em] text-muted-foreground">
          Department of Information Science and Engineering
        </p>
        <p className="mt-2.5 font-mono text-[clamp(0.6rem,0.78vw,0.8rem)] uppercase tracking-[0.3em] text-muted-foreground/70">
          19 – 21 November 2026 · Bengaluru
        </p>
      </section>
    </main>
  )
}
