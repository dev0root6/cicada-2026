"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createManager, type TeamState } from "@/app/admin/king/actions"
import { EventCheckboxes } from "./event-checkboxes"

export function CreateManagerForm({
  eventOptions,
}: {
  eventOptions: { slug: string; title: string }[]
}) {
  const [state, formAction] = useActionState<TeamState, FormData>(createManager, {})
  const [role, setRole] = useState("manager")

  return (
    <form action={formAction} className="surface space-y-5 p-6">
      <h3 className="text-base font-semibold">Add an account</h3>

      <div className="space-y-2">
        <Label htmlFor="new-username">Username</Label>
        <Input
          id="new-username"
          name="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="hackathon-lead"
          required
        />
        <p className="text-xs text-muted-foreground">
          3–32 characters: letters, numbers, dot, dash, underscore.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">Password</Label>
        <Input
          id="new-password"
          name="password"
          type="text"
          autoComplete="off"
          placeholder="at least 12 characters"
          required
          minLength={12}
        />
        <p className="text-xs text-muted-foreground">
          Shown in the clear so you can copy it — it is stored only as a hash, so this is the one
          moment it can be read. Send it to them over a private channel.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Role</legend>
        <div className="flex gap-2">
          {(["manager", "admin"] as const).map((value) => (
            <label
              key={value}
              className={`flex-1 cursor-pointer rounded-lg border px-3 py-2 text-center text-sm capitalize transition-colors ${
                role === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                className="sr-only"
              />
              {value}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {role === "manager"
            ? "Sees and edits only the events you tick below."
            : "Full access to every event, and can manage accounts."}
        </p>
      </fieldset>

      {role === "manager" && (
        <EventCheckboxes name="events" options={eventOptions} legend="Events they manage" />
      )}

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      {state.notice && <p className="text-sm text-primary">{state.notice}</p>}

      <Submit />
    </form>
  )
}

function Submit() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating…" : "Create account"}
    </Button>
  )
}
