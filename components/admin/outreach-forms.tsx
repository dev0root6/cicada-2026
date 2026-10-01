"use client"

import { useActionState, useState } from "react"
import { useFormStatus } from "react-dom"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendBroadcast, sendIndividual, type SimpleState } from "@/app/admin/king/actions"

export type KindOption = { value: string; label: string; description: string }

const fieldClass =
  "w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40"

function Feedback({ state }: { state: SimpleState }) {
  if (state.error) return <p role="alert" className="text-sm text-destructive">{state.error}</p>
  if (state.message) return <p role="status" className="text-sm text-primary">{state.message}</p>
  return null
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      <Send className="h-3.5 w-3.5" />
      {pending ? "Sending…" : label}
    </Button>
  )
}

function KindAndNote({ kinds, idPrefix }: { kinds: KindOption[]; idPrefix: string }) {
  const [kind, setKind] = useState(kinds[0]?.value ?? "")
  const current = kinds.find((k) => k.value === kind)
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-kind`}>Message</Label>
        <select
          id={`${idPrefix}-kind`}
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className={fieldClass}
        >
          {kinds.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
        {current && <p className="text-xs text-muted-foreground">{current.description}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-note`}>Note from the team (optional)</Label>
        <textarea
          id={`${idPrefix}-note`}
          name="note"
          rows={3}
          maxLength={600}
          placeholder="Added as a short paragraph at the end. Plain text."
          className={fieldClass}
        />
      </div>
    </>
  )
}

export function BroadcastForm({
  kinds,
  scopes,
}: {
  kinds: KindOption[]
  /** value "all" or an event slug, with its audience size. */
  scopes: { value: string; label: string; count: number }[]
}) {
  const [state, formAction] = useActionState<SimpleState, FormData>(sendBroadcast, {})
  const [scope, setScope] = useState("all")
  const audience = scopes.find((s) => s.value === scope)?.count ?? 0

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        const kind = (e.currentTarget.elements.namedItem("kind") as HTMLSelectElement).selectedOptions[0]?.text
        if (!window.confirm(`Send "${kind}" to up to ${audience} pre-registered ${audience === 1 ? "person" : "people"}?`)) {
          e.preventDefault()
        }
      }}
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="bc-scope">Who</Label>
        <select id="bc-scope" name="scope" value={scope} onChange={(e) => setScope(e.target.value)} className={fieldClass}>
          {scopes.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label} ({s.count})
            </option>
          ))}
        </select>
      </div>
      <KindAndNote kinds={kinds} idPrefix="bc" />
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="skipRecent" defaultChecked className="mt-1 accent-[#4cd97b]" />
        Skip anyone who already got this message in the last 24 hours (safe to press Send again)
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Submit label={`Send to ${audience}`} />
        <Feedback state={state} />
      </div>
    </form>
  )
}

export function IndividualForm({ kinds, emails }: { kinds: KindOption[]; emails: string[] }) {
  const [state, formAction] = useActionState<SimpleState, FormData>(sendIndividual, {})
  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="in-email">Pre-registered email</Label>
        <Input id="in-email" name="email" type="email" list="preregistered-emails" required autoComplete="off" placeholder="start typing…" />
        <datalist id="preregistered-emails">
          {emails.map((email) => (
            <option key={email} value={email} />
          ))}
        </datalist>
        <p className="text-xs text-muted-foreground">Only addresses on a pre-registration list can be emailed.</p>
      </div>
      <KindAndNote kinds={kinds} idPrefix="in" />
      <div className="flex flex-wrap items-center gap-3">
        <Submit label="Send email" />
        <Feedback state={state} />
      </div>
    </form>
  )
}
