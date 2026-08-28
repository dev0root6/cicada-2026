import "server-only"
import { cookies } from "next/headers"
import { SESSION_COOKIE, SESSION_TTL_SECONDS, getSessionSecret } from "./config"
import { signSession, verifySession, type SessionPayload } from "./crypto"

/** Reads and validates the session cookie. Returns null when signed out. */
export async function getSession(): Promise<SessionPayload | null> {
  const secret = getSessionSecret()
  if (!secret) return null

  const store = await cookies()
  return verifySession(store.get(SESSION_COOKIE)?.value, secret)
}

export async function createSession(username: string): Promise<void> {
  const secret = getSessionSecret()
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured")

  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const token = await signSession({ u: username, exp: expires }, secret)

  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true, // not readable from JavaScript, so XSS cannot exfiltrate it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // blocks cross-site POSTs from riding the session
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}
