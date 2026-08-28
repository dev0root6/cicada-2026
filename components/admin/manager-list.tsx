"use client"

import { useActionState, useState } from "react"
import { KeyRound, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EventCheckboxes } from "./event-checkboxes"
import {
  resetManagerPassword,
  toggleManagerDisabled,
  updateManagerEvents,
  type TeamState,
} from "@/app/admin/king/actions"
import type { AdminUser } from "@/lib/db/users"
import { formatDateTime } from "@/lib/format"

type Options = { slug: string; title: string }[]

export function ManagerList({
  users,
  eventOptions,
}: {
  users: AdminUser[]
  eventOptions: Options
}) {
  if (users.length === 0) {
    return (
      <div className="surface p-10 text-center">
        <p className="font-medium">No accounts yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The bootstrap admins from your environment variables are not listed here — only accounts
          created in this panel.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {users.map((user) => (
        <ManagerRow key={user.id} user={user} eventOptions={eventOptions} />
      ))}
    </ul>
  )
}

function ManagerRow({ user, eventOptions }: { user: AdminUser; eventOptions: Options }) {
  const [panel, setPanel] = useState<"none" | "events" | "password">("none")
  const disabled = Boolean(user.disabledAt)

  return (
    <li className={`surface p-5 ${disabled ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-medium">
            {user.username}
            <span
              className={`rounded-full border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider ${
                user.role === "admin"
                  ? "border-primary/40 text-primary"
                  : "border-border text-muted-foreground"
              }`}
            >
              {user.role}
            </span>
            {disabled && (
              <span className="rounded-full border border-destructive/40 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-destructive">
                disabled
              </span>
            )}
          </p>
          <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground">
            added {formatDateTime(user.createdAt)}
            {user.createdBy ? ` by ${user.createdBy}` : ""}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {user.role === "admin" ? (
              <span className="text-xs text-muted-foreground">All events</span>
            ) : user.events.length === 0 ? (
              <span className="text-xs text-destructive">No events assigned</span>
            ) : (
              user.events.map((slug) => (
                <span
                  key={slug}
                  className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                >
                  {slug}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {user.role === "manager" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPanel(panel === "events" ? "none" : "events")}
            >
              <Pencil className="h-3.5 w-3.5" />
              Events
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPanel(panel === "password" ? "none" : "password")}
          >
            <KeyRound className="h-3.5 w-3.5" />
            Password
          </Button>
          <DisableForm id={user.id} disabled={disabled} />
        </div>
      </div>

      {panel === "events" && (
        <EventsPanel id={user.id} events={user.events} eventOptions={eventOptions} />
      )}
      {panel === "password" && <PasswordPanel id={user.id} />}
    </li>
  )
}

function DisableForm({ id, disabled }: { id: number; disabled: boolean }) {
  const [, formAction] = useActionState<TeamState, FormData>(toggleManagerDisabled, {})
  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="disable" value={String(!disabled)} />
      <Button type="submit" variant="outline" size="sm">
        {disabled ? "Enable" : "Disable"}
      </Button>
    </form>
  )
}

function EventsPanel({
  id,
  events,
  eventOptions,
}: {
  id: number
  events: string[]
  eventOptions: Options
}) {
  const [state, formAction] = useActionState<TeamState, FormData>(updateManagerEvents, {})
  return (
    <form action={formAction} className="mt-5 space-y-3 border-t border-border pt-5">
      <input type="hidden" name="id" value={id} />
      <EventCheckboxes
        name="events"
        options={eventOptions}
        selected={events}
        legend="Events they manage"
      />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.notice && <p className="text-sm text-primary">{state.notice}</p>}
      <Button type="submit" size="sm">
        Save events
      </Button>
    </form>
  )
}

function PasswordPanel({ id }: { id: number }) {
  const [state, formAction] = useActionState<TeamState, FormData>(resetManagerPassword, {})
  return (
    <form action={formAction} className="mt-5 space-y-3 border-t border-border pt-5">
      <input type="hidden" name="id" value={id} />
      <Input
        name="password"
        type="text"
        minLength={12}
        required
        placeholder="new password, at least 12 characters"
      />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.notice && <p className="text-sm text-primary">{state.notice}</p>}
      <Button type="submit" size="sm">
        Set password
      </Button>
    </form>
  )
}
