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
import { isMailConfigured } from "@/lib/mail/transport"
import { requestOrigin } from "@/lib/mail/origin"
import { sendOutreach, sendRegistrationOpenAlert } from "@/lib/mail/send"
import { applySchema } from "@/lib/db/migrate"
import { HELLOWORLD_CLAIMED, setFlag } from "@/lib/db/flags"
import { isPreRegistered, listPreRegistered } from "@/lib/db/interest"
import { recentlySent } from "@/lib/db/email-log"
import { OUTREACH_KINDS, type OutreachKind } from "@/data/emails"

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

/* -------------------------------------------------------------------------- */
/* Priority-list alerts                                                        */
/* -------------------------------------------------------------------------- */

export type AlertState = { message?: string; error?: string }

/**
 * Emails an event's priority list that registrations are open. Admin-only:
 * it reaches real inboxes and cannot be taken back. Re-running it only emails
 * people who haven't been reached yet.
 */
export async function sendRegistrationAlert(
  eventSlug: string,
  _previous: AlertState,
): Promise<AlertState> {
  if (!(await requireAdmin())) return { error: "Admins only." }

  const event = events.find((e) => e.slug === eventSlug)
  if (!event) return { error: "Unknown event." }
  if (!isMailConfigured()) return { error: "Email isn't configured (MAIL_APP_PASSWD)." }

  try {
    const result = await sendRegistrationOpenAlert(event, await requestOrigin())
    revalidatePath("/admin/king/alerts")
    const parts = [`Sent ${result.sent}.`]
    if (result.failed) parts.push(`${result.failed} failed.`)
    if (result.remaining) parts.push(`${result.remaining} still waiting — send again to continue.`)
    return { message: parts.join(" ") }
  } catch (error) {
    console.error("registration alert failed", error)
    return { error: error instanceof Error ? error.message : "Could not send the alert." }
  }
}

/* -------------------------------------------------------------------------- */
/* System: database schema and the /helloworld easter egg                      */
/* -------------------------------------------------------------------------- */

export type SimpleState = { message?: string; error?: string }

/** Creates or updates every table from lib/db/schema.sql. Idempotent. */
export async function applySchemaAction(_previous: SimpleState): Promise<SimpleState> {
  if (!(await requireAdmin())) return { error: "Admins only." }
  if (!isDatabaseConfigured()) return { error: "DATABASE_URL isn't set on this deployment." }
  try {
    const count = await applySchema()
    revalidatePath("/admin/king/system")
    return { message: `Schema applied (${count} statements). All tables are ready.` }
  } catch (error) {
    console.error("apply schema failed", error)
    return { error: error instanceof Error ? error.message : "Could not apply the schema." }
  }
}

export async function setHelloworldClaimed(claimed: boolean): Promise<SimpleState> {
  const actor = await requireAdmin()
  if (!actor) return { error: "Admins only." }
  try {
    await setFlag(HELLOWORLD_CLAIMED, claimed ? "yes" : "no", actor.username)
  } catch (error) {
    console.error("helloworld flag failed", error)
    return { error: "Could not save. Has the schema been applied?" }
  }
  revalidatePath("/admin/king/system")
  revalidatePath("/helloworld")
  return { message: claimed ? "Marked as claimed." : "Reopened." }
}

/* -------------------------------------------------------------------------- */
/* Outreach: pre-registration and enrollment emails only                       */
/* -------------------------------------------------------------------------- */

const NOTE_MAX = 600
// Gmail allows ~500 messages a day; one click never spends more than this.
const BROADCAST_CAP = 300

function readOutreach(formData: FormData): { kind: OutreachKind; note: string } | { error: string } {
  const kind = String(formData.get("kind") ?? "") as OutreachKind
  if (!OUTREACH_KINDS.includes(kind)) return { error: "Pick a message type." }
  const note = String(formData.get("note") ?? "").trim()
  if (note.length > NOTE_MAX) return { error: `Keep the note under ${NOTE_MAX} characters.` }
  return { kind, note }
}

/** Emails everyone on a pre-registration list (all, or one event's). */
export async function sendBroadcast(_previous: SimpleState, formData: FormData): Promise<SimpleState> {
  const actor = await requireAdmin()
  if (!actor) return { error: "Admins only." }
  if (!isMailConfigured()) return { error: "Email isn't configured (MAIL_APP_PASSWD)." }

  const parsed = readOutreach(formData)
  if ("error" in parsed) return parsed

  const scope = String(formData.get("scope") ?? "all")
  const eventSlug = scope === "all" ? null : events.find((e) => e.slug === scope)?.slug
  if (scope !== "all" && !eventSlug) return { error: "Unknown event." }
  const skipRecent = formData.get("skipRecent") === "on"

  try {
    let recipients = await listPreRegistered(eventSlug)
    if (skipRecent) {
      const recent = await recentlySent(parsed.kind, 24)
      recipients = recipients.filter((r) => !recent.has(r.email))
    }
    if (!recipients.length) return { message: "Nobody to email — everyone on that list already got it in the last 24 hours, or the list is empty." }

    const batch = recipients.slice(0, BROADCAST_CAP)
    const result = await sendOutreach({
      kind: parsed.kind,
      recipients: batch,
      note: parsed.note,
      siteUrl: await requestOrigin(),
      sentBy: actor.username,
    })
    revalidatePath("/admin/king/outreach")
    const parts = [`Sent ${result.sent}.`]
    if (result.failed) parts.push(`${result.failed} failed.`)
    if (recipients.length > batch.length) {
      parts.push(`${recipients.length - batch.length} still to go — send again tomorrow (Gmail daily limit) with "skip recent" on.`)
    }
    return { message: parts.join(" ") }
  } catch (error) {
    console.error("broadcast failed", error)
    return { error: error instanceof Error ? error.message : "Could not send." }
  }
}

/** Emails one pre-registered person. */
export async function sendIndividual(_previous: SimpleState, formData: FormData): Promise<SimpleState> {
  const actor = await requireAdmin()
  if (!actor) return { error: "Admins only." }
  if (!isMailConfigured()) return { error: "Email isn't configured (MAIL_APP_PASSWD)." }

  const parsed = readOutreach(formData)
  if ("error" in parsed) return parsed
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  if (!email) return { error: "Enter an email address." }

  try {
    if (!(await isPreRegistered(email))) {
      return { error: "That address isn't on any pre-registration list. Outreach only goes to pre-registered people." }
    }
    const person = (await listPreRegistered()).find((p) => p.email === email)
    if (!person) return { error: "That address isn't on any pre-registration list." }
    const result = await sendOutreach({
      kind: parsed.kind,
      recipients: [person],
      note: parsed.note,
      siteUrl: await requestOrigin(),
      sentBy: actor.username,
    })
    revalidatePath("/admin/king/outreach")
    return result.sent ? { message: `Sent to ${email}.` } : { error: `Gmail rejected the email to ${email}.` }
  } catch (error) {
    console.error("individual email failed", error)
    return { error: error instanceof Error ? error.message : "Could not send." }
  }
}
