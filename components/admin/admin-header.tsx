import Link from "next/link"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/admin/king/actions"
import { site } from "@/data/site"

export function AdminHeader({ username }: { username: string }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
        <div>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary">
            {site.title} admin
          </p>
          <h1 className="mt-1 text-lg font-semibold">Registrations</h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            {username}
          </span>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">View site</Link>
          </Button>
          <form action={logout}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
