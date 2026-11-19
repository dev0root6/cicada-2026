"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"

import type { CeremonyState, Guest } from "@/lib/inauguration/shared"
import { cn } from "@/lib/utils"

const POLL_MS = 2500

/**
 * The chief guest's button.
 *
 * One job, one control, nothing else on the screen — this is held in someone's
 * hand on a stage. Once pressed it becomes a status display, and keeps polling
 * so the guest sees the room fill up and the moment of release.
 */
export function GuestButton({ guest, initial }: { guest: Guest; initial: CeremonyState }) {
  const [pressed, setPressed] = useState(Boolean(guest.pressedAt))
  const [state, setState] = useState<CeremonyState>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/inauguration/state", { cache: "no-store" })
      if (!res.ok) return
      const next = (await res.json()) as CeremonyState
      setState(next)
      // Trust the server over local state: it survives a reload on a new phone.
      const mine = next.guests.find((candidate) => candidate.id === guest.id)
      if (mine?.pressedAt) setPressed(true)
    } catch {
      /* keep the last good state */
    }
  }, [guest.id])

  useEffect(() => {
    const id = setInterval(refresh, POLL_MS)
    return () => clearInterval(id)
  }, [refresh])

  async function press() {
    if (pressed || busy) return
    setBusy(true)
    setError(null)
    // Optimistic: the guest sees their press land instantly, on a stage, in
    // front of a room. The poll corrects it if the write actually failed.
    setPressed(true)
    try {
      const res = await fetch("/api/inauguration/press", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: guest.id }),
      })
      if (!res.ok) {
        setPressed(false)
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "That didn't register. Try once more.")
        return
      }
      const data = await res.json()
      setState(data.state as CeremonyState)
    } catch {
      setPressed(false)
      setError("No connection. Try once more.")
    } finally {
      setBusy(false)
    }
  }

  const waiting = Math.max(0, state.guests.length - state.pressedCount)

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-center">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-primary">
        CICADA 2026 · Inauguration
      </p>

      <h1 className="mt-4 font-display text-2xl font-bold uppercase tracking-[0.04em] md:text-3xl">
        {guest.label}
      </h1>

      {!pressed ? (
        <>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            When the host gives the word, press and hold nothing — one tap is all
            it takes. CICADA 2026 is released once every guest has pressed.
          </p>

          <button
            type="button"
            onClick={() => void press()}
            disabled={busy}
            className="group relative mt-12 flex h-60 w-60 items-center justify-center rounded-full border-4 border-primary bg-primary/10 font-display text-xl font-bold uppercase tracking-[0.12em] text-primary transition-transform active:scale-95 disabled:opacity-60 md:h-72 md:w-72 md:text-2xl"
          >
            <span className="animate-beacon absolute inset-0 rounded-full bg-primary/10" aria-hidden />
            {busy ? <Loader2 className="h-10 w-10 animate-spin" aria-hidden /> : "Release"}
          </button>
        </>
      ) : (
        <>
          <div className="mt-12 flex h-60 w-60 items-center justify-center rounded-full border-4 border-primary bg-primary/20 md:h-72 md:w-72">
            <Check className="h-24 w-24 text-primary" aria-hidden />
          </div>
          <p className="mt-8 font-display text-xl font-bold uppercase tracking-[0.1em] text-primary">
            Pressed
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            {state.released
              ? "CICADA 2026 is released. Look at the screen."
              : waiting === 1
                ? "Waiting on one more guest."
                : `Waiting on ${waiting} more guests.`}
          </p>
        </>
      )}

      <p
        className={cn(
          "mt-10 font-mono text-[0.7rem] uppercase tracking-[0.22em]",
          state.released ? "text-primary" : "text-muted-foreground/70",
        )}
      >
        {state.pressedCount} of {state.guests.length} pressed
      </p>

      {error && (
        <p role="alert" className="mt-6 max-w-sm text-sm text-destructive">
          {error}
        </p>
      )}
    </main>
  )
}
