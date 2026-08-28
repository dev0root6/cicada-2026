import type { Metadata } from "next"
import { AdminHeader } from "@/components/admin/admin-header"
import { LoginScreen } from "@/components/admin/login-screen"
import { CreateManagerForm } from "@/components/admin/create-manager-form"
import { ManagerList } from "@/components/admin/manager-list"
import { getActor, isAdmin } from "@/lib/auth/actor"
import { isAuthConfigured } from "@/lib/auth/config"
import { isDatabaseConfigured } from "@/lib/db/client"
import { listUsers } from "@/lib/db/users"
import { events } from "@/data/events"

export const metadata: Metadata = {
  title: "Team",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function TeamPage() {
  const actor = await getActor()
  if (!actor) return <LoginScreen configured={isAuthConfigured()} />

  // Managers have no business here. Rendering the dashboard's own "not allowed"
  // state rather than redirecting keeps the URL stable.
  if (!isAdmin(actor)) {
    return (
      <>
        <AdminHeader actor={actor} />
        <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <div className="surface p-6">
            <p className="font-medium">Admins only</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Managing accounts is restricted to admin users.
            </p>
          </div>
        </main>
      </>
    )
  }

  const eventOptions = events.map((e) => ({ slug: e.slug, title: e.title.trim() }))

  return (
    <>
      <AdminHeader actor={actor} />
      <main className="mx-auto max-w-7xl space-y-8 px-5 py-8 md:px-8">
        <div>
          <h2 className="text-lg font-semibold">Team</h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            Managers sign in at the same address and see only the events assigned to them —
            registrations, attendance and exports are all filtered to their events. Admins see
            everything and can manage accounts.
          </p>
        </div>

        {isDatabaseConfigured() ? (
          <Body eventOptions={eventOptions} />
        ) : (
          <div className="surface p-6">
            <p className="font-medium">No database connected</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Manager accounts are stored in Postgres. Set{" "}
              <code className="font-mono text-primary">DATABASE_URL</code> and run{" "}
              <code className="font-mono text-primary">npm run db:migrate</code>.
            </p>
          </div>
        )}
      </main>
    </>
  )
}

async function Body({ eventOptions }: { eventOptions: { slug: string; title: string }[] }) {
  let users
  try {
    users = await listUsers()
  } catch (error) {
    return (
      <div className="surface p-6">
        <p className="font-medium text-destructive">Could not load accounts</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "Unknown database error."} If this is a fresh
          database, run <code className="font-mono text-primary">npm run db:migrate</code>.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <CreateManagerForm eventOptions={eventOptions} />
      </div>
      <div className="lg:col-span-7">
        <ManagerList users={users} eventOptions={eventOptions} />
      </div>
    </div>
  )
}
