"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  requestNotification,
  type NotifyState,
} from "@/app/(site)/events/[slug]/register/actions"

export function NotifyForm({ eventSlug }: { eventSlug: string }) {
  const [state, formAction] = useActionState<NotifyState, FormData>(
    requestNotification.bind(null, eventSlug),
    {},
  )

  if (state.status === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <p className="text-sm">
          You're on the list. We'll email you as soon as registrations open.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-3">
      <Label htmlFor="email">Email address</Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.email}
          key={state.email}
          required
          className="flex-1"
        />
        <SubmitButton />
      </div>
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />
      {state.status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Notify me"}
    </Button>
  )
}
