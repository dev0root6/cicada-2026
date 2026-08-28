import type { Metadata } from "next"
import { Suspense } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { LoginScreen } from "@/components/admin/login-screen"
import { Filters } from "@/components/admin/filters"
import { RegistrationsTable } from "@/components/admin/registrations-table"
import { StatTile } from "@/components/admin/stat-tile"
import { Button } from "@/components/ui/button"
import { getActor, isAdmin } from "@/lib/auth/actor"
import { isAuthConfigured } from "@/lib/auth/config"
import type { Actor } from "@/lib/auth/actor"
import { isDatabaseConfigured } from "@/lib/db/client"
import {
  listRegistrations,
  summariseByEvent,
  type PaymentStatus,
  PAYMENT_STATUSES,
} from "@/lib/db/registrations"
import { formatRupees } from "@/lib/format"
import { events } from "@/data/events"

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
}

// Registrations change constantly; never serve this from a cache.
export const dynamic = "force-dynamic"

type SearchParams = Promise<{ event?: string; status?: string; q?: string }>

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Signed out, this URL *is* the login screen. Rendering it in place rather
  // than redirecting means no Location header ever names an admin path.
  const actor = await getActor()
  if (!actor) return <LoginScreen configured={isAuthConfigured()} />

  const params = await searchParams
  // Only events this actor may see are valid filter values.
  const visibleEvents = events
    .filter((e) => actor.eventScope === null || actor.eventScope.includes(e.slug))
    .map((e) => ({ slug: e.slug, title: e.title.trim() }))
  const eventSlug = visibleEvents.some((e) => e.slug === params.event) ? params.event : undefined
  const status = PAYMENT_STATUSES.includes(params.status as PaymentStatus)
    ? (params.status as PaymentStatus)
    : undefined

  return (
    <>
      <AdminHeader actor={actor} />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8">
        {isDatabaseConfigured() ? (
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
            <DashboardBody
              actor={actor}
              visibleEvents={visibleEvents}
              eventSlug={eventSlug}
              status={status}
              search={params.q}
            />
          </Suspense>
        ) : (
          <DatabaseNotConfigured />
        )}
      </main>
    </>
  )
}

async function DashboardBody({
  actor,
  visibleEvents,
  eventSlug,
  status,
  search,
}: {
  actor: Actor
  visibleEvents: { slug: string; title: string }[]
  eventSlug?: string
  status?: PaymentStatus
  search?: string
}) {
  let registrations
  let summaries
  try {
    ;[registrations, summaries] = await Promise.all([
      listRegistrations({ eventSlug, status, search, eventScope: actor.eventScope }),
      summariseByEvent(actor.eventScope),
    ])
  } catch (error) {
    // Most often: the schema has not been applied yet.
    return (
      <div className="surface p-6">
        <p className="font-medium text-destructive">Could not read registrations</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown database error."}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          If this is a fresh database, apply the schema with{" "}
          <code className="font-mono text-primary">npm run db:migrate</code>.
        </p>
      </div>
    )
  }

  const totals = summaries.reduce(
    (acc, row) => ({
      total: acc.total + row.total,
      paid: acc.paid + row.paid,
      pending: acc.pending + row.pending,
      checkedIn: acc.checkedIn + row.checkedIn,
      collectedPaise: acc.collectedPaise + row.collectedPaise,
    }),
    { total: 0, paid: 0, pending: 0, checkedIn: 0, collectedPaise: 0 },
  )

  const exportQuery = new URLSearchParams()
  if (eventSlug) exportQuery.set("event", eventSlug)
  if (status) exportQuery.set("status", status)
  if (search) exportQuery.set("q", search)

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatTile label="Registrations" value={String(totals.total)} />
        <StatTile label="Paid" value={String(totals.paid)} />
        <StatTile label="Pending" value={String(totals.pending)} hint="Awaiting payment capture" />
        <StatTile
          label="Checked in"
          value={`${totals.checkedIn} / ${totals.paid}`}
          hint="Attendance vs paid"
        />
        <StatTile
          label="Collected"
          value={formatRupees(totals.collectedPaise)}
          hint="Paid registrations only"
        />
      </div>

      {summaries.length > 0 && (
        <section>
          <h2 className="mb-4 text-base font-semibold">By event</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summaries.map((row) => {
              const event = events.find((e) => e.slug === row.eventSlug)
              return (
                <div key={row.eventSlug} className="surface p-5">
                  <p className="font-medium">{event?.title.trim() ?? row.eventSlug}</p>
                  <p className="mt-3 font-display text-2xl font-semibold tabular-nums">
                    {row.total}
                  </p>
                  <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
                    <div className="flex gap-1">
                      <dt>paid</dt>
                      <dd className="text-primary">{row.paid}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt>pending</dt>
                      <dd>{row.pending}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt>failed</dt>
                      <dd>{row.failed}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt>in</dt>
                      <dd className="text-primary">{row.checkedIn}</dd>
                    </div>
                    <div className="flex gap-1">
                      <dt>collected</dt>
                      <dd>{formatRupees(row.collectedPaise)}</dd>
                    </div>
                  </dl>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-base font-semibold">
            Entries{" "}
            <span className="font-mono text-xs font-normal text-muted-foreground">
              ({registrations.length})
            </span>
          </h2>
          <Button asChild variant="outline" size="sm">
            <a href={`/admin/king/export?${exportQuery.toString()}`}>Export CSV</a>
          </Button>
        </div>

        <Suspense fallback={null}>
          <Filters events={visibleEvents} />
        </Suspense>

        <RegistrationsTable registrations={registrations} canEdit />
      </section>
    </>
  )
}

function DatabaseNotConfigured() {
  return (
    <div className="surface p-6">
      <p className="font-medium">No database connected</p>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground">
        Registrations are stored in Postgres. Add one from{" "}
        <span className="text-foreground">Vercel &rsaquo; Storage &rsaquo; Neon</span>, which sets{" "}
        <code className="font-mono text-primary">DATABASE_URL</code> automatically, then run{" "}
        <code className="font-mono text-primary">npm run db:migrate</code> to create the
        registrations table.
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Sign-in works without a database — only this page needs one.
      </p>
    </div>
  )
}
