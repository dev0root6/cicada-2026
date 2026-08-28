"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { PAYMENT_STATUSES } from "@/lib/db/types"
import { cn } from "@/lib/utils"

type FiltersProps = {
  events: { slug: string; title: string }[]
}

/**
 * Filters live in the URL so the view is shareable and the server component
 * re-renders with fresh data on every change.
 */
export function Filters({ events }: FiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()

  const [search, setSearch] = useState(params.get("q") ?? "")

  function apply(next: Record<string, string | null>) {
    const query = new URLSearchParams(params.toString())
    for (const [key, value] of Object.entries(next)) {
      if (value) query.set(key, value)
      else query.delete(key)
    }
    router.replace(`${pathname}?${query.toString()}`)
  }

  // Debounce so typing does not fire a request per keystroke.
  useEffect(() => {
    const current = params.get("q") ?? ""
    if (search === current) return
    const timer = setTimeout(() => apply({ q: search || null }), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const activeEvent = params.get("event")
  const activeStatus = params.get("status")

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search name, email, phone or team…"
        className="max-w-md"
      />

      <div className="flex flex-wrap gap-2">
        <Chip active={!activeEvent} onClick={() => apply({ event: null })}>
          All events
        </Chip>
        {events.map((event) => (
          <Chip
            key={event.slug}
            active={activeEvent === event.slug}
            onClick={() => apply({ event: event.slug })}
          >
            {event.title}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip active={!activeStatus} onClick={() => apply({ status: null })}>
          Any status
        </Chip>
        {PAYMENT_STATUSES.map((status) => (
          <Chip
            key={status}
            active={activeStatus === status}
            onClick={() => apply({ status })}
          >
            {status}
          </Chip>
        ))}
      </div>
    </div>
  )
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}
