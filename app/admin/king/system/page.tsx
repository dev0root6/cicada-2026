import type { Metadata } from "next"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOnly, Code, Panel } from "@/components/admin/admin-only"
import { LoginScreen } from "@/components/admin/login-screen"
import { ApplySchemaButton, EntityToggle } from "@/components/admin/system-controls"
import { getActor, isAdmin } from "@/lib/auth/actor"
import { isAuthConfigured } from "@/lib/auth/config"
import { isDatabaseConfigured } from "@/lib/db/client"
import { getEntityState } from "@/lib/db/flags"
import { tableStatus } from "@/lib/db/migrate"
import { isMailConfigured } from "@/lib/mail/transport"

export const metadata: Metadata = {
  title: "System",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"
export const maxDuration = 60

export default async function SystemPage() {
  const actor = await getActor()
  if (!actor) return <LoginScreen configured={isAuthConfigured()} />
  if (!isAdmin(actor)) return <AdminOnly actor={actor} what="System setup" />

  const dbConfigured = isDatabaseConfigured()
  let tables: Record<string, boolean> | null = null
  let dbError: string | null = null
  if (dbConfigured) {
    try {
      tables = await tableStatus()
    } catch (error) {
      dbError = error instanceof Error ? error.message : "Could not reach the database."
    }
  }
  const missing = tables ? Object.entries(tables).filter(([, ok]) => !ok).map(([name]) => name) : []
  const entity = await getEntityState()
  const byAdmin = entity.by?.startsWith("admin:")

  return (
    <>
      <AdminHeader actor={actor} />
      <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 md:px-8">
        <div>
          <h2 className="text-lg font-semibold">System</h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Database setup, email status and the <Code>/entity/helloworld</Code> hunt.
          </p>
        </div>

        <Panel title="Database">
          {!dbConfigured ? (
            <p className="text-sm text-muted-foreground">
              Not connected. Add <Code>DATABASE_URL</Code> (your Neon connection string) under Vercel →
              Settings → Environment Variables, then redeploy.
            </p>
          ) : dbError ? (
            <p className="text-sm text-destructive">Connected, but the database returned an error: {dbError}</p>
          ) : (
            <>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(tables ?? {}).map(([name, ok]) => (
                  <li key={name} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 font-mono text-xs">
                    {name}
                    <span className={ok ? "text-primary" : "text-destructive"}>{ok ? "ready" : "missing"}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">
                {missing.length
                  ? `${missing.length} table${missing.length === 1 ? " is" : "s are"} missing. Apply the schema to create ${missing.length === 1 ? "it" : "them"}.`
                  : "Everything is in place. Applying again is safe — it only adds what's missing."}
              </p>
            </>
          )}
          <ApplySchemaButton disabled={!dbConfigured} />
        </Panel>

        <Panel title="Email">
          <p className="text-sm text-muted-foreground">
            {isMailConfigured() ? (
              <>Gmail is configured. Sign-up confirmations, alerts and outreach can send.</>
            ) : (
              <>
                Not configured. Set <Code>MAIL_APP_PASSWD</Code> (Gmail app password) and{" "}
                <Code>MAIL_USER</Code> in Vercel, then redeploy.
              </>
            )}
          </p>
        </Panel>

        <Panel title="/entity/helloworld hunt">
          <p className="text-sm text-muted-foreground">
            Status:{" "}
            <span className={entity.destroyed ? "text-destructive" : "text-primary"}>
              {entity.destroyed ? "destroyed — everyone who signs in sees “Too late”" : "alive — the hunt is open"}
            </span>
            .
          </p>
          {entity.destroyed && (
            <p className="text-sm">
              {byAdmin ? (
                <>Marked destroyed by {entity.by?.slice(6)}</>
              ) : (
                <>
                  Winner: <Code>{entity.by ?? "unknown"}</Code>
                </>
              )}
              {entity.at && <span className="text-muted-foreground"> · {new Date(entity.at).toUTCString()}</span>}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            The path: <Code>/entity</Code> lures them to <Code>/entity/helloworld</Code>, they sign in with the
            credentials posted on Instagram, reroute the relay puzzle, press Emergency turn off and leave their email.
            The first one wins; open pages update within seconds.
          </p>
          <EntityToggle destroyed={entity.destroyed} />
        </Panel>
      </main>
    </>
  )
}
