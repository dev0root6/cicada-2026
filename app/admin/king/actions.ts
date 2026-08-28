"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { getAdminUsers, getSessionSecret } from "@/lib/auth/config"
import { verifyPassword, hashPassword } from "@/lib/auth/crypto"
import { checkRateLimit, clearAttempts, recordFailure } from "@/lib/auth/rate-limit"
import { createSession, destroySession } from "@/lib/auth/session"
import { isDatabaseConfigured } from "@/lib/db/client"
import { findActiveUser, createUser, setUserDisabled, setUserEvents, setUserPassword } from "@/lib/db/users"
import { setCheckedIn } from "@/lib/db/registrations"
import { getActor, isAdmin, type Actor } from "@/lib/auth/actor"
import { events } from "@/data/events"

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

  // Environment accounts are the bootstrap admins; database accounts are the
  // managers an admin created at runtime. Env wins, so a database row can never
  // shadow a bootstrap operator.
  let stored: string | undefined = getAdminUsers()[username]

  if (!stored && isDatabaseConfigured()) {
    try {
      const found = await findActiveUser(username)
      stored = found?.passwordDigest
    } catch (error) {
      console.error("admin sign-in: user lookup failed", error)
    }
  }

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

/* -------------------------------------------------------------------------- */
/* Registration edits                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Attendance toggle. Authorisation is not a UI concern: the actor's event scope
 * is passed into the WHERE clause, so a forged id for another manager's event
 * simply matches no rows.
 */
export async function toggleCheckIn(
  id: number,
  checkedIn: boolean,
): Promise<{ error?: string } | void> {
  const actor = await getActor()
  if (!actor) return { error: "Signed out." }

  try {
    const updated = await setCheckedIn({
      id,
      checkedIn,
      by: actor.username,
      eventScope: actor.eventScope,
    })
    if (!updated) return { error: "Not allowed for this event." }
  } catch (error) {
    console.error("check-in failed", error)
    return { error: "Could not save." }
  }

  revalidatePath("/admin/king")
}

/* -------------------------------------------------------------------------- */
/* Team management (admins only)                                               */
/* -------------------------------------------------------------------------- */

export type TeamState = { error?: string; notice?: string }

/** Every mutation below re-derives the actor; never trust a form field for role. */
async function requireAdmin(): Promise<Actor | null> {
  const actor = await getActor()
  return actor && isAdmin(actor) ? actor : null
}

export async function createManager(
  _previous: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const actor = await requireAdmin()
  if (!actor) return { error: "Admins only." }

  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase()
  const password = String(formData.get("password") ?? "")
  const role = String(formData.get("role") ?? "manager") === "admin" ? "admin" : "manager"
  const eventSlugs = formData.getAll("events").map(String)

  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    return { error: "Username must be 3–32 characters: a–z, 0–9, dot, dash, underscore." }
  }
  if (password.length < 12) {
    return { error: "Password must be at least 12 characters." }
  }
  // An admin spans every event, so an empty list is only wrong for a manager.
  if (role === "manager" && eventSlugs.length === 0) {
    return { error: "Pick at least one event for this manager." }
  }
  const valid = eventSlugs.filter((slug) => events.some((e) => e.slug === slug))
  if (valid.length !== eventSlugs.length) return { error: "Unknown event selected." }

  try {
    await createUser({
      username,
      passwordDigest: await hashPassword(password),
      role,
      events: valid,
      createdBy: actor.username,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : ""
    if (message.includes("admin_users_username_key")) {
      return { error: "That username already exists." }
    }
    console.error("create manager failed", error)
    return { error: "Could not create the account." }
  }

  revalidatePath("/admin/king/team")
  return { notice: `Created ${username}.` }
}

export async function updateManagerEvents(
  _previous: TeamState,
  formData: FormData,
): Promise<TeamState> {
  if (!(await requireAdmin())) return { error: "Admins only." }

  const id = Number(formData.get("id"))
  if (!Number.isInteger(id)) return { error: "Bad request." }

  const eventSlugs = formData
    .getAll("events")
    .map(String)
    .filter((slug) => events.some((e) => e.slug === slug))

  try {
    await setUserEvents(id, eventSlugs)
  } catch (error) {
    console.error("update events failed", error)
    return { error: "Could not save." }
  }

  revalidatePath("/admin/king/team")
  return { notice: "Events updated." }
}

export async function toggleManagerDisabled(
  _previous: TeamState,
  formData: FormData,
): Promise<TeamState> {
  const actor = await requireAdmin()
  if (!actor) return { error: "Admins only." }

  const id = Number(formData.get("id"))
  const disable = String(formData.get("disable")) === "true"
  if (!Number.isInteger(id)) return { error: "Bad request." }

  try {
    await setUserDisabled(id, disable)
  } catch (error) {
    console.error("toggle disabled failed", error)
    return { error: "Could not save." }
  }

  revalidatePath("/admin/king/team")
  return { notice: disable ? "Account disabled." : "Account re-enabled." }
}

export async function resetManagerPassword(
  _previous: TeamState,
  formData: FormData,
): Promise<TeamState> {
  if (!(await requireAdmin())) return { error: "Admins only." }

  const id = Number(formData.get("id"))
  const password = String(formData.get("password") ?? "")
  if (!Number.isInteger(id)) return { error: "Bad request." }
  if (password.length < 12) return { error: "Password must be at least 12 characters." }

  try {
    await setUserPassword(id, await hashPassword(password))
  } catch (error) {
    console.error("reset password failed", error)
    return { error: "Could not save." }
  }

  revalidatePath("/admin/king/team")
  return { notice: "Password updated." }
}
