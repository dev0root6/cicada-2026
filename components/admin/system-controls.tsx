"use client"

import { useActionState, useTransition, useState } from "react"
import { useFormStatus } from "react-dom"
import { Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { applySchemaAction, setHelloworldClaimed, type SimpleState } from "@/app/admin/king/actions"

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

export function HelloworldToggle({ claimed }: { claimed: boolean }) {
  const [state, setState] = useState<SimpleState>({})
  const [pending, startTransition] = useTransition()

  function flip(next: boolean) {
    const question = next
      ? "Mark /helloworld as claimed? Visitors will see the 'too slow' message instead."
      : "Reopen /helloworld? The gift message will show again."
    if (!window.confirm(question)) return
    startTransition(async () => setState(await setHelloworldClaimed(next)))
  }

  return (
    <div className="space-y-3">
      {claimed ? (
        <Button variant="outline" disabled={pending} onClick={() => flip(false)}>
          Reopen the easter egg
        </Button>
      ) : (
        <Button disabled={pending} onClick={() => flip(true)}>
          Mark as claimed
        </Button>
      )}
      <Feedback state={state} />
    </div>
  )
}
