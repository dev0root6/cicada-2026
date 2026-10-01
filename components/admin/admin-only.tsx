import { AdminHeader } from "@/components/admin/admin-header"
import type { Actor } from "@/lib/auth/actor"

/** Shown to signed-in managers who open an admin-only page. */
export function AdminOnly({ actor, what }: { actor: Actor; what: string }) {
  return (
    <>
      <AdminHeader actor={actor} />
      <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <div className="surface p-6">
          <p className="font-medium">Admins only</p>
          <p className="mt-2 text-sm text-muted-foreground">{what} is restricted to admin users.</p>
        </div>
      </main>
    </>
  )
}

export function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface space-y-4 p-6">
      <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.14em]">{title}</h3>
      {children}
    </section>
  )
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="font-mono text-primary">{children}</code>
}
