"use client"

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import Link from "next/link"
import { Instagram } from "lucide-react"
import { WaspMark } from "@/components/brand/wasp"
import {
  shutdownAction,
  signInAction,
  submitRouteAction,
  type LoginState,
  type ShutdownState,
} from "@/app/entity/helloworld/actions"
import { COLS, CORE_ROW, LAYOUT, ROWS, SOURCE_ROW, trace, type TileKind } from "@/lib/entity/puzzle"
import { useEntityStatus } from "./live"

const INSTAGRAM = "https://www.instagram.com/cicada_atria.it/"

type Props = { signedIn: boolean; destroyed: boolean; killReady: boolean }

export function EntityConsole(props: Props) {
  const [signedIn, setSignedIn] = useState(props.signedIn)
  const [killReady, setKillReady] = useState(props.killReady)
  const destroyed = useEntityStatus(props.destroyed)

  return (
    <div className="entity-card relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#3d7bff]/30 bg-[#070b1f]/90 p-6 font-mono shadow-[0_0_80px_rgb(255_59_79/0.15),0_0_60px_rgb(61_123_255/0.15)] backdrop-blur md:p-9">
      <Header />
      {!signedIn ? (
        <SignIn onSuccess={() => setSignedIn(true)} />
      ) : destroyed ? (
        <TooLate />
      ) : !killReady ? (
        <Relay onSolved={() => setKillReady(true)} />
      ) : (
        <Shutdown />
      )}
    </div>
  )
}

function Header() {
  return (
    <div className="flex items-center gap-3 border-b border-[#3d7bff]/25 pb-4 text-[0.7rem] uppercase tracking-[0.22em] text-[#9db4ff]">
      <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff3b4f] shadow-[0_0_10px_#ff3b4f]" />
      <span>helloworld // core console</span>
      <span className="ml-auto text-[#ff3b4f]">restricted</span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* 1. Sign in. No hints in the fields: the credentials are on our Instagram.  */
/* -------------------------------------------------------------------------- */

function SignIn({ onSuccess }: { onSuccess: () => void }) {
  const [state, action] = useActionState<LoginState, FormData>(signInAction, {})
  useEffect(() => {
    if (state.ok) onSuccess()
  }, [state.ok, onSuccess])

  return (
    <div className="mt-7">
      <div className="flex flex-col items-center text-center">
        <WaspMark className="entity-wasp h-28 w-auto drop-shadow-[0_0_24px_rgb(255_210_63/0.45)]" />
        <h1 className="mt-5 text-xl font-semibold tracking-wide text-white md:text-2xl">Identify yourself, operator</h1>
        <p className="mt-2 text-sm text-[#9db4ff]">Only the operator who built me may enter.</p>
      </div>

      <form action={action} className="mt-7 space-y-4" autoComplete="off">
        <Field id="entity-user" name="username" label="Operator ID" type="text" />
        <Field id="entity-pass" name="password" label="Passphrase" type="password" />
        <SignInButton />
        {state.error && (
          <p role="alert" className="text-center text-sm text-[#ff6b7a]">
            {state.error}
          </p>
        )}
      </form>

      <div className="mt-7 space-y-2 border-t border-[#3d7bff]/20 pt-5 text-xs leading-relaxed text-[#9db4ff]">
        <p>
          <span className="text-[#ffd23f]">› hint:</span> the operator was careless. His credentials leaked
          somewhere public. <span className="text-white">It&apos;s in here:</span>
        </p>
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-md border border-[#ffd23f]/40 px-3 py-1.5 text-[#ffd23f] transition-colors hover:bg-[#ffd23f]/10"
        >
          <Instagram className="h-4 w-4" /> @cicada_atria.it
        </a>
        {(state.attempts ?? 0) >= 2 && (
          <p className="pt-1 text-[#ff8a96]">
            › still locked out? Look closer. Captions, comments, highlights. Operators always leave something
            behind.
          </p>
        )}
      </div>
    </div>
  )
}

function Field({ id, name, label, type }: { id: string; name: string; label: string; type: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[0.65rem] uppercase tracking-[0.24em] text-[#9db4ff]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="w-full rounded-lg border border-[#3d7bff]/35 bg-[#03061a] px-4 py-3 text-base text-white outline-none transition focus:border-[#ff3b4f] focus:shadow-[0_0_0_4px_rgb(255_59_79/0.15)]"
      />
    </div>
  )
}

function SignInButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-gradient-to-r from-[#ff3b4f] to-[#3d7bff] py-3 text-sm font-bold uppercase tracking-[0.24em] text-white shadow-[0_0_30px_rgb(255_59_79/0.35)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd23f] disabled:opacity-60"
    >
      {pending ? "Verifying…" : "Authenticate"}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* 2. The relay: route the kill signal into the core.                          */
/* -------------------------------------------------------------------------- */

function scrambled(): number[] {
  for (;;) {
    const r = LAYOUT.map(() => Math.floor(Math.random() * 4))
    if (!trace(r).done && trace(r).lit.size < 3) return r
  }
}

function Relay({ onSolved }: { onSolved: () => void }) {
  const [rot, setRot] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [pending, startTransition] = useTransition()
  // Random start only on the client, so the server render and hydration agree.
  useEffect(() => setRot(scrambled()), [])
  const { lit, done } = useMemo(() => (rot ? trace(rot) : { lit: new Set<number>(), done: false }), [rot])
  const sent = useRef(false)

  useEffect(() => {
    if (!done || !rot || sent.current) return
    sent.current = true
    setLocked(true)
    startTransition(async () => {
      const result = await submitRouteAction(rot)
      if (result.ok) setTimeout(onSolved, 1100)
      else {
        sent.current = false
        setLocked(false)
        setError(result.error ?? "Try again.")
      }
    })
  }, [done, rot, onSolved])

  const turn = (i: number) => {
    if (locked || !rot) return
    setError(null)
    setRot(rot.map((r, j) => (j === i ? (r + 1) % 4 : r)))
  }

  return (
    <div className="mt-7">
      <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[#ff3b4f]">access granted · task 1 of 1</p>
      <h2 className="mt-2 text-xl font-semibold text-white">Break its network</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#b9c8ff]">
        I have no body, yet I carry every word it speaks. Mend my broken paths and your signal will reach its
        heart.
      </p>
      <p className="mt-2 text-xs text-[#9db4ff]">
        Tap a relay to rotate it. Route the <span className="text-[#ffd23f]">kill signal</span> from the left into the{" "}
        <span className="text-[#ff3b4f]">core</span> on the right.
      </p>

      <div className="relative mx-auto mt-6 w-full max-w-[27rem] px-14">
        <span
          className="absolute left-0 w-14 pr-1 text-right text-[0.6rem] uppercase leading-tight tracking-[0.16em] text-[#ffd23f]"
          style={{ top: `${((SOURCE_ROW + 0.5) / ROWS) * 100}%`, transform: "translateY(-50%)" }}
        >
          signal ▸
        </span>
        <span
          className={`absolute right-0 w-14 pl-1 text-[0.6rem] uppercase leading-tight tracking-[0.16em] ${done ? "text-[#ffd23f]" : "text-[#ff3b4f]"}`}
          style={{ top: `${((CORE_ROW + 0.5) / ROWS) * 100}%`, transform: "translateY(-50%)" }}
        >
          ◂ core
        </span>
        <div
          className={`grid gap-1 rounded-xl border p-1.5 transition ${done ? "border-[#ffd23f] shadow-[0_0_40px_rgb(255_210_63/0.35)]" : "border-[#3d7bff]/40"}`}
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {LAYOUT.map((kind, i) => (
            <Tile
              key={i}
              kind={kind}
              rotation={rot?.[i] ?? 0}
              lit={lit.has(i)}
              done={done}
              onTurn={() => turn(i)}
              label={`Relay ${Math.floor(i / COLS) + 1}-${(i % COLS) + 1}`}
            />
          ))}
        </div>
      </div>

      <p role="status" className="mt-5 min-h-[1.25rem] text-center text-sm">
        {error ? (
          <span className="text-[#ff6b7a]">{error}</span>
        ) : done ? (
          <span className="text-[#ffd23f]">{pending ? "Signal locked. Verifying route…" : "Route verified."}</span>
        ) : (
          <span className="text-[#9db4ff]">{lit.size} relays carrying the signal</span>
        )}
      </p>
    </div>
  )
}

const PATHS: Record<TileKind, string> = {
  line: "M50 0 V100",
  bend: "M50 0 V50 H100",
  tee: "M50 0 V100 M50 50 H100",
  cross: "M50 0 V100 M0 50 H100",
}

function Tile(props: { kind: TileKind; rotation: number; lit: boolean; done: boolean; onTurn: () => void; label: string }) {
  const { kind, rotation, lit, done, onTurn, label } = props
  const colour = lit ? (done ? "#ffd23f" : "#ff3b4f") : "#3d7bff"
  return (
    <button
      type="button"
      onClick={onTurn}
      aria-label={label}
      className="aspect-square rounded-md bg-[#03061a] outline-none transition hover:bg-[#0b1238] focus-visible:ring-2 focus-visible:ring-[#ffd23f]"
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <g style={{ transform: `rotate(${rotation * 90}deg)`, transformOrigin: "50px 50px", transition: "transform .18s ease-out" }}>
          <path d={PATHS[kind]} stroke={colour} strokeWidth="12" strokeLinecap="round" fill="none" opacity={lit ? 1 : 0.55} style={lit ? { filter: `drop-shadow(0 0 6px ${colour})` } : undefined} />
        </g>
        <circle cx="50" cy="50" r="11" fill="#03061a" stroke={colour} strokeWidth="5" />
      </svg>
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* 3. The switch.                                                              */
/* -------------------------------------------------------------------------- */

function Shutdown() {
  const [armed, setArmed] = useState(false)
  const [state, action] = useActionState<ShutdownState, FormData>(shutdownAction, {})
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (armed) emailRef.current?.focus()
  }, [armed])

  if (state.late) return <TooLate />

  return (
    <div className="mt-7 text-center">
      <p className="text-[0.65rem] uppercase tracking-[0.26em] text-[#ffd23f]">signal in the core · switch exposed</p>
      <h2 className="mt-2 text-xl font-semibold text-white">One press ends it</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#b9c8ff]">
        The entity is exposed. Nobody else has pulled the switch yet. Be the one who does.
      </p>

      {!armed ? (
        <button
          type="button"
          onClick={() => setArmed(true)}
          className="entity-hazard group mx-auto mt-8 grid h-48 w-48 place-items-center rounded-full p-3 outline-none focus-visible:ring-4 focus-visible:ring-[#ffd23f]"
        >
          <span className="grid h-full w-full place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff7a88,#ff3b4f_45%,#a30f24)] text-sm font-bold uppercase leading-snug tracking-[0.18em] text-white shadow-[0_10px_0_#5c0612,0_0_60px_rgb(255_59_79/0.6)] transition group-active:translate-y-2 group-active:shadow-[0_2px_0_#5c0612,0_0_60px_rgb(255_59_79/0.6)]">
            Emergency
            <br />
            turn off
          </span>
        </button>
      ) : (
        <form action={action} className="mx-auto mt-7 max-w-sm space-y-4 text-left">
          <p className="text-sm text-white">Who pulled the switch? Leave your email so we can find you.</p>
          <div className="space-y-1.5">
            <label htmlFor="entity-email" className="text-[0.65rem] uppercase tracking-[0.24em] text-[#9db4ff]">
              Your email
            </label>
            <input
              ref={emailRef}
              key={state.email ?? ""}
              defaultValue={state.email}
              id="entity-email"
              name="email"
              type="email"
              required
              maxLength={200}
              className="w-full rounded-lg border border-[#ffd23f]/45 bg-[#03061a] px-4 py-3 text-base text-white outline-none focus:border-[#ffd23f] focus:shadow-[0_0_0_4px_rgb(255_210_63/0.15)]"
            />
          </div>
          <ShutdownButton />
          {state.error && (
            <p role="alert" className="text-sm text-[#ff6b7a]">
              {state.error}
            </p>
          )}
        </form>
      )}
    </div>
  )
}

function ShutdownButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-[#ff3b4f] py-3 text-sm font-bold uppercase tracking-[0.24em] text-white shadow-[0_0_30px_rgb(255_59_79/0.45)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd23f] disabled:opacity-60"
    >
      {pending ? "Shutting it down…" : "Confirm turn off"}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* 4. Someone got there first.                                                 */
/* -------------------------------------------------------------------------- */

function TooLate() {
  return (
    <div className="mt-7 text-center">
      <WaspMark className="mx-auto h-24 w-auto opacity-40 grayscale" />
      <p className="mt-6 text-[0.65rem] uppercase tracking-[0.26em] text-[#ff3b4f]">process helloworld · terminated</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">Too late.</h2>
      <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-[#b9c8ff]">
        The entity was found and destroyed by someone. Thank you.
      </p>
      <Link
        href="/home"
        className="mt-8 inline-block text-[0.7rem] uppercase tracking-[0.22em] text-[#9db4ff] transition-colors hover:text-[#ffd23f]"
      >
        {"// back to the fest"}
      </Link>
    </div>
  )
}
