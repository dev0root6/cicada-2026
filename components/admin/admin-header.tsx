import Link from "next/link"
import { BellRing, LogOut, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/admin/king/actions"
import { site } from "@/data/site"
import type { Actor } from "@/lib/auth/actor"

export function AdminHeader({ actor }: { actor: Actor }) {
  const admin = actor.role === "admin"

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary">
            {site.title} admin
          </p>
          <h1 className="mt-1 text-lg font-semibold">Registrations</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-xs">
            {actor.username}
            <span className={admin ? "text-primary" : "text-muted-foreground"}>{actor.role}</span>
          </span>

          {/* Team management is admin-only; the server action re-checks. */}
          {admin && (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/king/team">
                  <Users className="h-3.5 w-3.5" />
                  Team
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/king/alerts">
                  <BellRing className="h-3.5 w-3.5" />
                  Alerts
                </Link>
              </Button>
            </>
          )}

          <Button asChild variant="ghost" size="sm">
            <Link href="/home">View site</Link>
          </Button>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {/* A manager should always be able to see which events they cover. */}
      {actor.eventScope && (
        <div className="border-t border-border bg-card/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-5 py-2.5 md:px-8">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground">
              Your events
            </span>
            {actor.eventScope.length === 0 ? (
              <span className="text-xs text-muted-foreground">
                None assigned yet — ask an admin.
              </span>
            ) : (
              actor.eventScope.map((slug) => (
                <span key={slug} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[0.65rem]">
                  {slug}
                </span>
              ))
            )}
          </div>
        </div>
      )}
    </header>
  )
}
