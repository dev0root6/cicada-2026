import type { Metadata } from "next"
import { EntityBackdrop } from "@/components/entity/backdrop"
import { EntityConsole } from "@/components/entity/console"
import { getEntityState } from "@/lib/db/flags"
import { canKill, isSignedIn } from "@/lib/entity/auth"

export const metadata: Metadata = {
  title: "helloworld",
  robots: { index: false, follow: false, nocache: true },
}

// Status and session are read on every request.
export const dynamic = "force-dynamic"

/**
 * The entity's console. Sign in with credentials hidden on our Instagram,
 * reroute its network, then pull the emergency switch. The first person to do
 * it wins; everyone after sees that someone got there first.
 */
export default async function HelloworldPage() {
  const [state, signedIn, killReady] = await Promise.all([getEntityState(), isSignedIn(), canKill()])
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-12">
      <EntityBackdrop />
      <EntityConsole signedIn={signedIn} destroyed={state.destroyed} killReady={killReady} />
    </main>
  )
}
