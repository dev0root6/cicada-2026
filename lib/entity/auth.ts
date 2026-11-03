import "server-only"
import { cookies } from "next/headers"
import { getSessionSecret } from "@/lib/auth/config"
import { signSession, timingSafeEqual, verifySession } from "@/lib/auth/crypto"

/**
 * Access to the entity console. The credentials are a puzzle (they are hidden
 * on our Instagram), so only a digest lives here: reading the source doesn't
 * give the answer away.
 *
 *   sha256("entity:" + username + ":" + password), username lowercased
 */
const ACCESS_DIGEST = "9e3c5ffcb1b471fdba4e10a6ba549ff8f76f3d0cd3f4b4acc5d0ff58dde24079"

const SESSION = "entity_session"
const KILL = "entity_kill"
const SESSION_TTL = 2 * 60 * 60
/** Time between solving the relay and pressing the button. */
const KILL_TTL = 20 * 60

async function sha256Hex(text: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)))
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

export async function credentialsMatch(username: string, password: string): Promise<boolean> {
  const digest = await sha256Hex(`entity:${username.trim().toLowerCase()}:${password}`)
  return timingSafeEqual(digest, ACCESS_DIGEST)
}

/** Separate from admin sessions: a token from here never opens the admin console. */
function secret(): string | null {
  const base = getSessionSecret() ?? process.env.DATABASE_URL ?? process.env.POSTGRES_URL
  if (base) return `entity-hunt:${base}`
  return process.env.NODE_ENV === "production" ? null : "entity-hunt:local-development-only"
}

export function canSignIn(): boolean {
  return secret() !== null
}

async function setToken(name: string, subject: string, ttl: number) {
  const key = secret()
  if (!key) throw new Error("not configured")
  const token = await signSession({ u: subject, exp: Math.floor(Date.now() / 1000) + ttl }, key)
  ;(await cookies()).set(name, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ttl,
  })
}

async function hasToken(name: string, subject: string): Promise<boolean> {
  const key = secret()
  if (!key) return false
  const payload = await verifySession((await cookies()).get(name)?.value, key)
  return payload?.u === subject
}

export const startSession = () => setToken(SESSION, "operator", SESSION_TTL)
export const isSignedIn = () => hasToken(SESSION, "operator")
export const grantKill = () => setToken(KILL, "kill", KILL_TTL)
export const canKill = () => hasToken(KILL, "kill")
