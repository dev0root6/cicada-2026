import type { Metadata } from "next"
import Link from "next/link"
import { BUG_SRC } from "@/components/brand/logo"
import { HeistBackdrop } from "@/components/visuals/heist-backdrop"
import { isHelloworldClaimed } from "@/lib/db/flags"

export const metadata: Metadata = {
  title: "hello, world",
  robots: { index: false, follow: false, nocache: true },
}

// Read the "claimed" switch on every request; admins flip it from the console.
export const dynamic = "force-dynamic"

const REPORT_TO = "atriacicada@gmail.com"

/**
 * Easter egg for curious visitors. Linked from nowhere. The first person to
 * report it (screenshot + email) wins a gift; once an admin marks it claimed
 * in /admin/king/system, the message is replaced.
 */
export default async function HelloWorld() {
  const claimed = await isHelloworldClaimed()
  const stamp = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC"

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <HeistBackdrop />

      <div className="hud-corners w-full max-w-2xl rounded-2xl border border-border bg-card p-6 font-mono shadow-[0_0_60px_rgb(76_217_123/0.12)] md:p-10">
        <div className="flex items-center gap-3 border-b border-border pb-4 text-xs text-muted-foreground">
          <img src={BUG_SRC} alt="" aria-hidden className="glow h-5 w-auto" />
          <span className="uppercase tracking-[0.2em]">cicada@atria:~$</span>
          <span className="ml-auto">{stamp}</span>
        </div>

        <p className="mt-6 text-sm text-primary">&gt; whoami</p>

        {claimed ? (
          <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground md:text-lg">
            <p>Too slow, human.</p>
            <p className="text-muted-foreground">
              Someone already found this place and reported it. The prize is gone.
            </p>
            <p className="text-muted-foreground">
              But you made it here, which says something. Keep digging. We hide more than one
              door.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground md:text-lg">
            <p>
              Hey human, you&apos;re <span className="text-primary">still trying to do some recon</span>?
            </p>
            <p>
              If you&apos;ve found me, take a <span className="text-primary">screenshot</span> of this
              page and email it to{" "}
              <a
                href={`mailto:${REPORT_TO}?subject=${encodeURIComponent("I found /helloworld")}`}
                className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                {REPORT_TO}
              </a>
              .
            </p>
            <p>
              You&apos;ll get a <span className="text-primary">surprising gift</span> from us.
            </p>
            <p className="border-l-2 border-primary/60 pl-4 text-sm text-muted-foreground md:text-base">
              This message is only visible until someone reports it, which means you found it
              first!!!
            </p>
          </div>
        )}

        <p className="mt-8 text-sm text-primary">
          &gt; <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-primary" />
        </p>

        <p className="mt-6 text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground/70">
          <Link href="/home" className="transition-colors hover:text-primary">
            {"// back to the fest"}
          </Link>
        </p>
      </div>
    </main>
  )
}
