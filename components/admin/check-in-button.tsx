"use client"

import { useState, useTransition } from "react"
import { Check, Undo2 } from "lucide-react"
import { toggleCheckIn } from "@/app/admin/king/actions"
import { cn } from "@/lib/utils"

/**
 * Attendance toggle. Optimistic so the gate queue keeps moving, but it reverts
 * and surfaces the reason if the server rejects — which it will for a manager
 * acting on an event outside their scope.
 */
export function CheckInButton({
  id,
  checkedIn,
  checkedInBy,
}: {
  id: number
  checkedIn: boolean
  checkedInBy: string | null
}) {
  const [pending, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useState(checkedIn)
  const [error, setError] = useState<string | null>(null)

  function onClick() {
    const next = !optimistic
    setOptimistic(next)
    setError(null)
    startTransition(async () => {
      const result = await toggleCheckIn(id, next)
      if (result?.error) {
        setOptimistic(!next)
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        title={checkedInBy ? `Checked in by ${checkedInBy}` : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-wider transition-colors disabled:opacity-60",
          optimistic
            ? "border-primary/40 bg-primary/10 text-primary hover:border-primary"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        {optimistic ? <Check className="h-3 w-3" /> : <Undo2 className="h-3 w-3" />}
        {optimistic ? "In" : "Check in"}
      </button>
      {error && <span className="text-[0.65rem] text-destructive">{error}</span>}
    </div>
  )
}
