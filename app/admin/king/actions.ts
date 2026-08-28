"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getAdminUsers, getSessionSecret } from "@/lib/auth/config"
import { verifyPassword } from "@/lib/auth/crypto"
import { checkRateLimit, clearAttempts, recordFailure } from "@/lib/auth/rate-limit"
import { createSession, destroySession } from "@/lib/auth/session"

export type LoginState = { error?: string }

/** Same message whether the user or the password was wrong — no account enumeration. */
const INVALID = "Invalid username or password."

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!username || !password) return { error: INVALID }

  if (!getSessionSecret()) {
    return { error: "Admin auth is not configured on this deployment (ADMIN_SESSION_SECRET)." }
  }

  const headerList = await headers()
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    return { error: `Too many attempts. Try again in ${limit.retryAfterSeconds}s.` }
  }

  const users = getAdminUsers()
  const stored = users[username]

  // Hash even when the user is unknown, so a missing account and a wrong
  // password take the same time and cannot be told apart.
  const digest = stored ?? "pbkdf2:210000:00:00"
  const ok = (await verifyPassword(password, digest)) && Boolean(stored)

  if (!ok) {
    recordFailure(ip)
    return { error: INVALID }
  }

  clearAttempts(ip)
  await createSession(username)

  // Same URL the form was served from, so the redirect discloses nothing that
  // the visitor did not already know.
  redirect("/admin/king")
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect("/admin/king")
}
