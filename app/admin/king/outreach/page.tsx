import type { Metadata } from "next"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminOnly, Code, Panel } from "@/components/admin/admin-only"
import { LoginScreen } from "@/components/admin/login-screen"
import { BroadcastForm, IndividualForm } from "@/components/admin/outreach-forms"
import { getActor, isAdmin } from "@/lib/auth/actor"
import { isAuthConfigured } from "@/lib/auth/config"
import { isDatabaseConfigured } from "@/lib/db/client"
import { recentEmails } from "@/lib/db/email-log"
import { listPreRegistered } from "@/lib/db/interest"
import { isMailConfigured } from "@/lib/mail/transport"
import { OUTREACH_KINDS, outreachTemplates } from "@/data/emails"
import { events } from "@/data/events"

export const metadata: Metadata = {
  title: "Outreach",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"
// A broadcast sends through Gmail in waves; give it room.
export const maxDuration = 60

export default async function OutreachPage() {
  const actor = await getActor()
  if (!actor) return <LoginScreen configured={isAuthConfigured()} />
  if (!isAdmin(actor)) return <AdminOnly actor={actor} what="Outreach" />

  return (
    <>
      <AdminHeader actor={actor} />
      <main className="mx-auto max-w-7xl space-y-6 px-5 py-8 md:px-8">
        <div>
          <h2 className="text-lg font-semibold">Outreach</h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Email people who pre-registered — only about their pre-registration or about enrolling.
            The wording lives in <Code>data/emails.ts</Code>; you can add a short note.
          </p>
        </div>

        {!isMailConfigured() && (
          <Panel title="Email not configured">
            <p className="text-sm text-muted-foreground">
              Set <Code>MAIL_APP_PASSWD</Code> and <Code>MAIL_USER</Code> in Vercel, then redeploy.
            </p>
          </Panel>
        )}

        {isDatabaseConfigured() ? (
          <Body />
        ) : (
          <Panel title="No database connected">
            <p className="text-sm text-muted-foreground">
              Set <Code>DATABASE_URL</Code>, redeploy, then apply the schema from the System page.
            </p>
          </Panel>
        )}
      </main>
    </>
  )
}

async function Body() {
  let everyone, recent
  try {
    ;[everyone, recent] = await Promise.all([listPreRegistered(), recentEmails(15)])
  } catch (error) {
    console.error("outreach: load failed", error)
    return (
      <Panel title="Could not load the lists">
        <p className="text-sm text-muted-foreground">
          If this is a new database, apply the schema from the System page first.
        </p>
      </Panel>
    )
  }

  const kinds = OUTREACH_KINDS.map((k) => ({
    value: k,
    label: outreachTemplates[k].label,
    description: outreachTemplates[k].description,
  }))
  const scopes = [
    { value: "all", label: "Everyone pre-registered", count: everyone.length },
    ...events.map((e) => ({
      value: e.slug,
      label: e.title.trim(),
      count: everyone.filter((p) => p.events.includes(e.slug)).length,
    })),
  ]

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Send to a list">
          <BroadcastForm kinds={kinds} scopes={scopes} />
        </Panel>
        <Panel title="Send to one person">
          <IndividualForm kinds={kinds} emails={everyone.map((p) => p.email)} />
        </Panel>
      </div>

      <Panel title="Recently sent">
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing sent yet.</p>
        ) : (
          <ul className="divide-y divide-border font-mono text-xs">
            {recent.map((r, i) => (
              <li key={i} className="flex flex-wrap gap-x-4 gap-y-1 py-2">
                <span className="text-muted-foreground">{r.sentAt.replace("T", " ").slice(0, 16)}</span>
                <span className="text-primary">{r.kind}</span>
                <span>{r.recipient}</span>
                <span className="ml-auto text-muted-foreground">by {r.sentBy}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  )
}
