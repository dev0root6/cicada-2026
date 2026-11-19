import "server-only"

/**
 * The admin console at /in/inaugration is gated by a shared passcode rather
 * than the main admin login: it is handed to whoever is running the ceremony
 * on the day, who is not necessarily an admin user.
 *
 * With INAUG_ADMIN_KEY unset the console still works — nobody should be locked
 * out of their own inauguration by a missing environment variable — but it
 * says loudly that it is unprotected.
 */

export function adminKey(): string | null {
  const key = process.env.INAUG_ADMIN_KEY?.trim()
  return key ? key : null
}

export function isAdminProtected(): boolean {
  return adminKey() !== null
}

/** True when `supplied` may run admin actions. Open when no key is configured. */
export function checkAdminKey(supplied: string | null | undefined): boolean {
  const expected = adminKey()
  if (!expected) return true
  if (!supplied) return false
  return supplied === expected
}
