/**
 * Shapes and constants shared by the ceremony's server and client code.
 *
 * Kept out of lib/db/inauguration.ts and lib/inauguration/auth.ts because both
 * are "server-only": importing a value (rather than a type) from either into a
 * client component fails the build.
 */

export type Guest = {
  id: string
  label: string
  position: number
  pressedAt: string | null
}

export type CeremonyState = {
  /** False when there is no database configured, so the UI can say so. */
  ready: boolean
  guestCount: number
  pressedCount: number
  released: boolean
  releasedAt: string | null
  guests: Guest[]
}

/** Header the console sends the admin passcode in. */
export const ADMIN_HEADER = "x-inaug-key"
