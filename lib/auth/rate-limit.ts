/**
 * Best-effort in-memory throttle for failed sign-in attempts.
 *
 * Serverless instances are per-region and recycled, so this is a speed bump
 * against casual brute force, not a guarantee. The real defence is a 24-character
 * random password with a PBKDF2 digest. Move this to Redis/KV if the admin
 * surface ever grows beyond a couple of trusted operators.
 */

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  sweep(now)

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) return { allowed: true, retryAfterSeconds: 0 }
  if (bucket.count < MAX_ATTEMPTS) return { allowed: true, retryAfterSeconds: 0 }

  return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
}

export function recordFailure(key: string): void {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return
  }
  bucket.count += 1
}

export function clearAttempts(key: string): void {
  buckets.delete(key)
}
