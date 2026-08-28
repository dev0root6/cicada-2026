/**
 * Auth primitives built on Web Crypto only, so they run unchanged in the Edge
 * middleware and in Node route handlers. No external dependencies.
 */

const encoder = new TextEncoder()

/* -------------------------------------------------------------------------- */
/* Encoding                                                                    */
/* -------------------------------------------------------------------------- */

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/")
  const binary = atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, "="))
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return bytes
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

/**
 * Compares two strings in time independent of where they first differ, so an
 * attacker cannot learn a secret byte-by-byte from response timing.
 */
export function timingSafeEqual(a: string, b: string): boolean {
  // Length is not secret here, but bail without a short-circuit comparison.
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/* -------------------------------------------------------------------------- */
/* Password hashing                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Serialised as `pbkdf2:<iterations>:<saltHex>:<hashHex>`.
 *
 * Colon-delimited on purpose. Next.js runs dotenv-expand over .env files, so a
 * `$` in a value is treated as variable interpolation and silently eats the
 * rest of the string — and because platform-set variables are NOT expanded,
 * a `$`-delimited digest works in production but breaks locally.
 */
const PBKDF2_PREFIX = "pbkdf2"

async function pbkdf2(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    256,
  )
  return new Uint8Array(bits)
}

/** Default work factor for new digests (OWASP 2023 guidance for PBKDF2-SHA256). */
const PBKDF2_ITERATIONS = 210_000

/**
 * Produces a `pbkdf2:<iterations>:<saltHex>:<hashHex>` digest with a fresh
 * random salt. Used when an admin creates a manager account at runtime; the
 * plaintext is never stored or logged.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS)
  return `${PBKDF2_PREFIX}:${PBKDF2_ITERATIONS}:${bytesToHex(salt)}:${bytesToHex(derived)}`
}

/**
 * Verifies a password against a stored PBKDF2 digest. Returns false rather than
 * throwing on a malformed digest, so a misconfigured env var denies access
 * instead of surfacing an error to the client.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(":")
  if (parts.length !== 4 || parts[0] !== PBKDF2_PREFIX) return false

  const iterations = Number.parseInt(parts[1], 10)
  if (!Number.isInteger(iterations) || iterations < 1000) return false
  if (!/^[0-9a-f]+$/i.test(parts[2]) || !/^[0-9a-f]+$/i.test(parts[3])) return false

  const derived = await pbkdf2(password, hexToBytes(parts[2]), iterations)
  return timingSafeEqual(bytesToHex(derived), parts[3].toLowerCase())
}

/* -------------------------------------------------------------------------- */
/* Session tokens                                                              */
/* -------------------------------------------------------------------------- */

export type SessionPayload = {
  /** Username. */
  u: string
  /** Expiry, epoch seconds. */
  exp: number
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
}

/**
 * Signs a session as `<payload>.<hmac>`. The payload is signed, not encrypted —
 * it holds only a username and an expiry, both of which the user already knows.
 */
export async function signSession(payload: SessionPayload, secret: string): Promise<string> {
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)))
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body))
  return `${body}.${toBase64Url(new Uint8Array(signature))}`
}

/** Returns the payload only if the signature is valid and the token is unexpired. */
export async function verifySession(
  token: string | undefined,
  secret: string,
): Promise<SessionPayload | null> {
  if (!token) return null

  const separator = token.lastIndexOf(".")
  if (separator <= 0) return null

  const body = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  const expected = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(body))
  if (!timingSafeEqual(signature, toBase64Url(new Uint8Array(expected)))) return null

  try {
    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as SessionPayload
    if (typeof payload.u !== "string" || typeof payload.exp !== "number") return null
    if (payload.exp * 1000 < Date.now()) return null
    return payload
  } catch {
    return null
  }
}
