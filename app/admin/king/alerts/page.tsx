import type { Metadata } from "next"
import { AdminHeader } from "@/components/admin/admin-header"
import { LoginScreen } from "@/components/admin/login-screen"
import { SendAlertButton } from "@/components/admin/send-alert-button"
import { getActor, isAdmin } from "@/lib/auth/actor"
import { isAuthConfigured } from "@/lib/auth/config"
import { isDatabaseConfigured } from "@/lib/db/client"
import { summariseInterest } from "@/lib/db/interest"
import { isMailConfigured } from "@/lib/mail/transport"
import { emailTemplates } from "@/data/emails"
import { events } from "@/data/events"

export const metadata: Metadata = {
  title: "Alerts",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"
// Sending a batch through Gmail can take a while.
export const maxDuration = 60

export default async function AlertsPage() {
  const actor = await getActor()
  if (!actor) return <LoginScreen configured={isAuthConfigured()} />

  if (!isAdmin(actor)) {
    return (
      <>
        <AdminHeader actor={actor} />
        <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <div className="surface p-6">
            <p className="font-medium">Admins only</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Sending alerts is restricted to admin users.
            </p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AdminHeader actor={actor} />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8">
        <div>
          <h2 className="text-lg font-semibold">Priority-list alerts</h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            People who asked to be notified on an event&apos;s &ldquo;registration opens
            soon&rdquo; page. Once an event has a <code className="font-mono text-primary">registerUrl</code>{" "}
            in <code className="font-mono text-primary">data/events.ts</code>, send them the
            &ldquo;registrations are open&rdquo; email. Copy lives in{" "}
            <code className="font-mono text-primary">data/emails.ts</code>. Each person is emailed
            once; re-sending only reaches whoever is still waiting.
          </p>
        </div>

        {!isMailConfigured() && (
          <div className="surface p-6">
            <p className="font-medium">Email not configured</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Set <code className="font-mono text-primary">MAIL_APP_PASSWD</code> (a Gmail app
              password) and <code className="font-mono text-primary">MAIL_USER</code> in the
              environment.
            </p>
          </div>
        )}

        {isDatabaseConfigured() ? (
          <AlertsTable />
        ) : (
          <div className="surface p-6">
            <p className="font-medium">No database connected</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign-ups are stored in Postgres. Set{" "}
              <code className="font-mono text-primary">DATABASE_URL</code> and run{" "}
              <code className="font-mono text-primary">npm run db:migrate</code>.
            </p>
          </div>
        )}
      </main>
    </>
  )
}

async function AlertsTable() {
  let summary
  try {
    summary = await summariseInterest()
  } catch (error) {
    console.error("alerts: summary failed", error)
    return (
      <div className="surface p-6">
        <p className="font-medium text-destructive">Could not load sign-ups</p>
        <p className="mt-2 text-sm text-muted-foreground">
          If this is a new deployment, run <code className="font-mono text-primary">npm run db:migrate</code>.
        </p>
      </div>
    )
  }

  const mailReady = isMailConfigured()

  return (
    <div className="surface divide-y divide-border">
      {events.map((event) => {
        const counts = summary.find((s) => s.eventSlug === event.slug) ?? { waiting: 0, notified: 0 }
        const disabledReason = !mailReady
          ? "Email isn't configured."
          : !emailTemplates.registrationOpen.enabled
            ? "Disabled in data/emails.ts."
            : !event.registerUrl
              ? "Add a registerUrl first."
              : undefined

        return (
          <div key={event.slug} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">{event.title.trim()}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                <span className="text-primary">{counts.waiting}</span> waiting ·{" "}
                {counts.notified} notified ·{" "}
                {event.registerUrl ? "registrations open" : "registrations not open"}
              </p>
            </div>
            <SendAlertButton
              eventSlug={event.slug}
              eventTitle={event.title.trim()}
              waiting={counts.waiting}
              disabledReason={disabledReason}
            />
          </div>
        )
      })}
    </div>
  )
}
