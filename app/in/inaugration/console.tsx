"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Copy, KeyRound, Loader2, RotateCcw, Trash2, Users } from "lucide-react"

import { ADMIN_HEADER, type CeremonyState, type Guest } from "@/lib/inauguration/shared"
import { cn } from "@/lib/utils"

const POLL_MS = 2000

/** Remembered per browser so a reload mid-ceremony doesn't ask again. */
const KEY_STORAGE = "cicada:inaug-key"

type Props = { initial: CeremonyState; protectedByKey: boolean }

export function AdminConsole({ initial, protectedByKey }: Props) {
  const [state, setState] = useState<CeremonyState>(initial)
  const [count, setCount] = useState(2)
  const [key, setKey] = useState("")
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [origin, setOrigin] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    try {
      const saved = sessionStorage.getItem(KEY_STORAGE)
      if (saved) setKey(saved)
    } catch {
      /* private mode */
    }
  }, [])

  // Live view of who has pressed, so the console works as a second dashboard.
  useEffect(() => {
    let alive = true
    const tick = async () => {
      try {
        const res = await fetch("/api/inauguration/state", { cache: "no-store" })
        if (!res.ok) return
        const next = (await res.json()) as CeremonyState
        if (alive) setState(next)
      } catch {
        /* keep the last good state */
      }
    }
    const id = setInterval(tick, POLL_MS)
    void tick()
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  const act = useCallback(
    async (action: "create" | "reset" | "clear", extra: Record<string, unknown> = {}) => {
      setBusy(action)
      setError(null)
      try {
        const res = await fetch("/api/inauguration/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json", [ADMIN_HEADER]: key },
          body: JSON.stringify({ action, ...extra }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error ?? "That didn't work.")
          return
        }
        setState(data.state as CeremonyState)
        try {
          if (key) sessionStorage.setItem(KEY_STORAGE, key)
        } catch {
          /* private mode */
        }
      } catch {
        setError("Could not reach the server. Check the connection and try again.")
      } finally {
        setBusy(null)
      }
    },
    [key],
  )

  async function copy(text: string, id: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      setTimeout(() => setCopied((current) => (current === id ? null : current)), 1600)
    } catch {
      setError("Couldn't copy — select the link and copy it by hand.")
    }
  }

  const link = (guest: Guest) => `${origin}/in/${guest.id}`

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 md:py-14">
      <header className="border-b border-border pb-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-primary">
          CICADA 2026 · Inauguration
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.03em] md:text-4xl">
          Ceremony console
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Set how many chief guests are in the room, hand each one their link, and
          watch the presses land. The reveal happens on{" "}
          <a href="/in/dashboard" className="text-primary hover:underline">
            /in/dashboard
          </a>{" "}
          once every guest has pressed.
        </p>
      </header>

      {!state.ready && (
        <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm text-amber-200">
          No database reachable, or the ceremony tables have not been created yet.
          Apply the schema from the admin console, then reload this page.
        </p>
      )}

      {!protectedByKey && (
        <p className="mt-6 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 text-sm text-amber-200">
          <b>This console is unprotected.</b> Anyone with the URL can reset the
          ceremony. Set <code className="font-mono">INAUG_ADMIN_KEY</code> in the
          Vercel environment variables to require a passcode.
        </p>
      )}

      {protectedByKey && (
        <label className="mt-7 flex flex-col gap-2">
          <span className="flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
            <KeyRound className="h-3.5 w-3.5" aria-hidden />
            Admin passcode
          </span>
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="INAUG_ADMIN_KEY"
            className="w-full max-w-sm rounded-lg border border-border bg-card px-3.5 py-2.5 font-mono text-sm outline-none focus:border-primary"
          />
        </label>
      )}

      {/* ---- step 1: how many guests ---- */}
      <section className="mt-9 rounded-xl border border-border bg-card/40 p-6">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold">
          <Users className="h-4.5 w-4.5 text-primary" aria-hidden />
          1 · How many chief guests?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Generating codes replaces any existing ones and clears every press, so
          do this once, before the guests arrive.
        </p>

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-muted-foreground">
              Guests in the room
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="w-28 rounded-lg border border-border bg-card px-3.5 py-2.5 text-center font-mono text-lg outline-none focus:border-primary"
            />
          </label>

          <button
            type="button"
            onClick={() => void act("create", { count })}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-mono text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-background transition-opacity disabled:opacity-50"
          >
            {busy === "create" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Generate links
          </button>
        </div>
      </section>

      {/* ---- step 2: the links ---- */}
      <section className="mt-6 rounded-xl border border-border bg-card/40 p-6">
        <h2 className="text-lg font-semibold">2 · Hand out the links</h2>

        {state.guests.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No guests yet. Generate the links above.
          </p>
        ) : (
          <ul className="mt-5 space-y-3">
            {state.guests.map((guest) => (
              <li
                key={guest.id}
                className={cn(
                  "flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border p-4",
                  guest.pressedAt
                    ? "border-primary/40 bg-primary/5"
                    : "border-border bg-background/50",
                )}
              >
                <span className="font-mono text-sm font-semibold text-foreground">
                  {guest.label}
                </span>
                <code className="rounded bg-background px-2.5 py-1 font-mono text-sm text-primary">
                  {origin ? `${origin}/in/${guest.id}` : `/in/${guest.id}`}
                </code>
                <button
                  type="button"
                  onClick={() => void copy(link(guest), guest.id)}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/50 hover:text-primary"
                >
                  {copied === guest.id ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                  )}
                  {copied === guest.id ? "Copied" : "Copy"}
                </button>
                <span
                  className={cn(
                    "ml-auto font-mono text-[0.65rem] uppercase tracking-[0.18em]",
                    guest.pressedAt ? "text-primary" : "text-muted-foreground/70",
                  )}
                >
                  {guest.pressedAt ? "Pressed" : "Waiting"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ---- step 3: live count ---- */}
      <section className="mt-6 rounded-xl border border-border bg-card/40 p-6">
        <h2 className="text-lg font-semibold">3 · The release</h2>
        <p className="mt-3 font-mono text-4xl font-bold text-primary">
          {state.pressedCount}
          <span className="text-xl text-muted-foreground"> / {state.guests.length}</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {state.released
            ? "Released — the dashboard is showing the reveal."
            : "Waiting for every guest to press."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void act("reset")}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-50"
          >
            {busy === "reset" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            )}
            Clear presses (keep links)
          </button>
          <button
            type="button"
            onClick={() => void act("clear")}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/40 px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-destructive hover:border-destructive disabled:opacity-50"
          >
            {busy === "clear" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
            )}
            Remove all guests
          </button>
        </div>
      </section>

      {error && (
        <p role="alert" className="mt-5 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}
    </main>
  )
}
