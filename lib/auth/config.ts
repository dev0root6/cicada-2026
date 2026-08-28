/**
 * Admin credentials are read from the environment, never from source control.
 * Each admin is one `ADMIN_USER_<NAME>` variable holding a PBKDF2 digest:
 *
 *   ADMIN_USER_KING1=pbkdf2:210000:<saltHex>:<hashHex>
 *
 * Generate one with `node scripts/hash-password.mjs`.
 */

export const SESSION_COOKIE = "cicada_admin"

/** Eight hours; admins re-authenticate daily rather than holding a long session. */
export const SESSION_TTL_SECONDS = 8 * 60 * 60

const USER_ENV_PREFIX = "ADMIN_USER_"

export function getSessionSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET
  // A short secret would weaken every session token, so treat it as unset.
  return secret && secret.length >= 32 ? secret : null
}

/** Maps lowercase username to its stored password digest. */
export function getAdminUsers(): Record<string, string> {
  const users: Record<string, string> = {}
  for (const [key, value] of Object.entries(process.env)) {
    if (!key.startsWith(USER_ENV_PREFIX) || !value) continue
    const username = key.slice(USER_ENV_PREFIX.length).toLowerCase()
    if (username) users[username] = value
  }
  return users
}

/** True when the environment is complete enough to sign anybody in. */
export function isAuthConfigured(): boolean {
  return getSessionSecret() !== null && Object.keys(getAdminUsers()).length > 0
}
