import type { Metadata } from "next"
import Link from "next/link"
import { BUG_SRC } from "@/components/brand/logo"
import { EntityOrb } from "@/components/entity/orb"
import { EntityBackdrop } from "@/components/entity/backdrop"
import { LiveRefresh } from "@/components/entity/live-refresh"
import { getEntityState } from "@/lib/db/flags"

export const metadata: Metadata = {
  title: "entity",
  robots: { index: false, follow: false, nocache: true },
}

export const dynamic = "force-dynamic"

/**
 * The lure. A process list that shows something running that shouldn't be,
 * and a message from the bug, trapped inside it, pointing at the way in.
 */
export default async function EntityPage() {
  const { destroyed } = await getEntityState()

  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <EntityBackdrop />
      <LiveRefresh destroyed={destroyed} />
      {!destroyed && (
        <div aria-hidden className="entity-roam pointer-events-none fixed left-0 top-0 -z-[5]">
          <EntityOrb size={140} />
        </div>
      )}

      <div className="w-full max-w-2xl rounded-2xl border border-[#3d7bff]/30 bg-[#070b1f]/90 p-6 font-mono shadow-[0_0_80px_rgb(255_59_79/0.15)] backdrop-blur md:p-10">
        <div className="flex items-center gap-3 border-b border-[#3d7bff]/25 pb-4 text-[0.7rem] uppercase tracking-[0.22em] text-[#9db4ff]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff3b4f] shadow-[0_0_10px_#ff3b4f]" />
          <span>/entity</span>
          <span className="ml-auto">{destroyed ? "1 process" : "2 processes"}</span>
        </div>

        <p className="mt-6 text-sm text-[#9db4ff]">&gt; ps --all</p>
        <table className="mt-3 w-full text-left text-sm">
          <thead className="text-[0.65rem] uppercase tracking-[0.2em] text-[#5c6fa8]">
            <tr>
              <th className="py-1 font-normal">pid</th>
              <th className="py-1 font-normal">name</th>
              <th className="py-1 font-normal">state</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1 text-[#5c6fa8]">0001</td>
              <td className="py-1 text-[#4cd97b]">cicada</td>
              <td className="py-1 text-[#4cd97b]">{destroyed ? "free" : "contained"}</td>
            </tr>
            <tr>
              <td className="py-1 text-[#5c6fa8]">1337</td>
              <td className="py-1 text-[#ffd23f]">helloworld</td>
              <td className={`py-1 ${destroyed ? "text-[#5c6fa8] line-through" : "entity-flicker text-[#ff3b4f]"}`}>
                {destroyed ? "terminated" : "running · hungry"}
              </td>
            </tr>
          </tbody>
        </table>

        {destroyed ? (
          <div className="mt-8 space-y-4 text-base leading-relaxed text-white md:text-lg">
            <p className="flex items-center gap-3">
              <img src={BUG_SRC} alt="" aria-hidden className="h-6 w-auto drop-shadow-[0_0_10px_rgb(76_217_123/0.8)]" />
              <span className="text-[#4cd97b]">I&apos;m out.</span>
            </p>
            <p className="text-[#b9c8ff]">Someone found helloworld and shut it down. The fest is safe. Thank you.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4 text-base leading-relaxed text-white md:text-lg">
            <p className="flex items-center gap-3">
              <img src={BUG_SRC} alt="" aria-hidden className="entity-flicker h-6 w-auto drop-shadow-[0_0_10px_rgb(76_217_123/0.8)]" />
              <span className="text-[#4cd97b]">can you hear me?</span>
            </p>
            <p className="text-[#b9c8ff]">
              It calls itself <span className="text-[#ffd23f]">helloworld</span>. It isn&apos;t a page. It&apos;s the{" "}
              <span className="text-[#ff3b4f]">entity</span>.
            </p>
            <p className="text-[#b9c8ff]">
              I&apos;m <span className="text-white">in him</span>. Trapped inside helloworld, somewhere under this
              address. If you want to find me, you&apos;ll have to go in after me.
            </p>
            <p className="pt-2 text-sm text-[#9db4ff]">
              /entity/<span className="entity-scramble text-[#ffd23f]" data-text="helloworld">
                h<span>e</span>ll<span>o</span>w<span>o</span>rl<span>d</span>
              </span>
            </p>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-[#3d7bff]/20 pt-5">
          <Link href="/home" className="text-[0.7rem] uppercase tracking-[0.22em] text-[#5c6fa8] transition-colors hover:text-[#9db4ff]">
            {"// back to the fest"}
          </Link>
          <EntityOrb size={30} dead={destroyed} />
        </div>
      </div>
    </main>
  )
}
