import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BUG_SRC } from "@/components/brand/logo"
import { HeistBackdrop } from "@/components/visuals/heist-backdrop"

export const metadata: Metadata = {
  title: "404 — Nothing here",
  robots: { index: false, follow: false },
}

/**
 * Rendered for any unknown URL. It sits outside the (site) layout, so it brings
 * its own backdrop rather than the navbar and footer.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <HeistBackdrop />

      <img
        src={BUG_SRC}
        alt=""
        aria-hidden
        className="glow animate-glitch-in w-[clamp(110px,18vw,170px)] opacity-90"
      />

      <p className="mt-8 font-mono text-[clamp(4.5rem,16vw,9rem)] font-bold leading-none tracking-[0.06em] text-primary drop-shadow-[0_0_30px_rgb(76_217_123/0.35)]">
        404
      </p>

      <p className="eyebrow mt-6">Signal lost</p>
      <h1 className="mt-3 text-2xl font-semibold md:text-4xl">This vault is empty</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Whatever you were looking for isn&apos;t behind this door. Wrong turn, old link, or
        you&apos;re doing a little recon of your own.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/home">Back to base</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/events">Browse events</Link>
        </Button>
      </div>

      <p className="mt-10 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground/70">
        {"// error 404 · route not found"}
      </p>
    </main>
  )
}
