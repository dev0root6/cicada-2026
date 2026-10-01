import type { Metadata } from "next"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOnly, Code, Panel } from "@/components/admin/admin-only"
import { LoginScreen } from "@/components/admin/login-screen"
import { ApplySchemaButton, HelloworldToggle } from "@/components/admin/system-controls"
import { getActor, isAdmin } from "@/lib/auth/actor"
import { isAuthConfigured } from "@/lib/auth/config"
import { isDatabaseConfigured } from "@/lib/db/client"
import { isHelloworldClaimed } from "@/lib/db/flags"
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
  const claimed = await isHelloworldClaimed()

  return (
    <>
      <AdminHeader actor={actor} />
      <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 md:px-8">
        <div>
          <h2 className="text-lg font-semibold">System</h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Database setup, email status and the <Code>/helloworld</Code> easter egg.
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

        <Panel title="/helloworld easter egg">
          <p className="text-sm text-muted-foreground">
            Status:{" "}
            <span className={claimed ? "text-destructive" : "text-primary"}>
              {claimed ? "claimed — visitors see the “too slow” message" : "open — the gift message is showing"}
            </span>
            . When someone emails a screenshot to atriacicada@gmail.com, mark it claimed.
          </p>
          <HelloworldToggle claimed={claimed} />
        </Panel>
      </main>
    </>
  )
}
