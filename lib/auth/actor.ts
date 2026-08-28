import "server-only"
import { getAdminUsers } from "./config"
import { getSession } from "./session"
import { isDatabaseConfigured } from "@/lib/db/client"
import { findActiveUser } from "@/lib/db/users"
import type { AdminRole } from "@/lib/db/users"

/**
 * Who is making this request, and what they are allowed to touch.
 *
 * Scope is resolved from the database on every request rather than baked into
 * the session cookie, so disabling a manager or changing their events takes
 * effect immediately instead of when their cookie happens to expire.
 */
export type Actor = {
  username: string
  role: AdminRole
  /** null means every event (admins). An array is an explicit allow-list. */
  eventScope: string[] | null
}

export function isAdmin(actor: Actor): boolean {
  return actor.role === "admin"
}

/** True when this actor may read or modify records for `slug`. */
export function canAccessEvent(actor: Actor, slug: string): boolean {
  return actor.eventScope === null || actor.eventScope.includes(slug)
}

/**
 * Resolves the signed-in actor, or null. Environment-defined accounts are
 * always admins — they are the bootstrap operators and cannot be locked out by
 * database state.
 */
export async function getActor(): Promise<Actor | null> {
  const session = await getSession()
  if (!session) return null

  const username = session.u.toLowerCase()

  if (Object.prototype.hasOwnProperty.call(getAdminUsers(), username)) {
    return { username, role: "admin", eventScope: null }
  }

  // Anything else must be a live database account. If the database is
  // unreachable we deny rather than guess at permissions.
  if (!isDatabaseConfigured()) return null

  const found = await findActiveUser(username)
  if (!found) return null

  return {
    username: found.user.username,
    role: found.user.role,
    eventScope: found.user.role === "admin" ? null : found.user.events,
  }
}
