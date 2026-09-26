"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { sendRegistrationAlert, type AlertState } from "@/app/admin/king/actions"

export function SendAlertButton({
  eventSlug,
  eventTitle,
  waiting,
  disabledReason,
}: {
  eventSlug: string
  eventTitle: string
  waiting: number
  disabledReason?: string
}) {
  const [state, formAction] = useActionState<AlertState>(
    sendRegistrationAlert.bind(null, eventSlug),
    {},
  )

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const ok = window.confirm(
          `Email ${waiting} ${waiting === 1 ? "person" : "people"} that registrations for ${eventTitle} are open? This can't be undone.`,
        )
        if (!ok) e.preventDefault()
      }}
      className="flex flex-col items-end gap-1.5"
    >
      <Submit disabled={Boolean(disabledReason) || waiting === 0} />
      {disabledReason && <p className="text-right text-xs text-muted-foreground">{disabledReason}</p>}
      {state.message && <p role="status" className="text-right text-xs text-primary">{state.message}</p>}
      {state.error && <p role="alert" className="text-right text-xs text-destructive">{state.error}</p>}
    </form>
  )
}

function Submit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="sm" disabled={disabled || pending}>
      <Send className="h-3.5 w-3.5" />
      {pending ? "Sending…" : "Send alert"}
    </Button>
  )
}
