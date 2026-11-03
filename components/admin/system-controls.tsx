"use client"

import { useActionState, useTransition, useState } from "react"
import { useFormStatus } from "react-dom"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { applySchemaAction, setEntityDestroyed, type SimpleState } from "@/app/admin/king/actions"

function Feedback({ state }: { state: SimpleState }) {
  if (state.error) return <p role="alert" className="text-sm text-destructive">{state.error}</p>
  if (state.message) return <p role="status" className="text-sm text-primary">{state.message}</p>
  return null
}

export function ApplySchemaButton({ disabled }: { disabled?: boolean }) {
  const [state, formAction] = useActionState<SimpleState>(applySchemaAction, {})
  return (
    <form action={formAction} className="space-y-3">
      <SchemaSubmit disabled={disabled} />
      <Feedback state={state} />
    </form>
  )
}

function SchemaSubmit({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={disabled || pending}>
      <Database className="h-4 w-4" />
      {pending ? "Applying…" : "Apply schema"}
    </Button>
  )
}

export function EntityToggle({ destroyed }: { destroyed: boolean }) {
  const [state, setState] = useState<SimpleState>({})
  const [pending, startTransition] = useTransition()

  function flip(next: boolean) {
    const question = next
      ? "Mark the entity as destroyed? Everyone who signs in will see 'Too late'."
      : "Bring the entity back? This clears the winner, and the hunt opens again for everyone."
    if (!window.confirm(question)) return
    startTransition(async () => setState(await setEntityDestroyed(next)))
  }

  return (
    <div className="space-y-3">
      {destroyed ? (
        <Button variant="outline" disabled={pending} onClick={() => flip(false)}>
          Bring the entity back
        </Button>
      ) : (
        <Button variant="outline" disabled={pending} onClick={() => flip(true)}>
          Mark as destroyed
        </Button>
      )}
      <Feedback state={state} />
    </div>
  )
}
