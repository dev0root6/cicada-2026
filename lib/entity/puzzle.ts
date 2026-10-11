/**
 * The relay puzzle behind /entity/helloworld: a grid of network tiles the
 * player rotates until the kill signal on the left reaches the core on the
 * right. Shared by the client (to draw and light up the route) and the server
 * (which re-checks the route before unlocking the turn-off button).
 */

export const COLS = 5
export const ROWS = 5
/** The signal enters from the left edge of this row... */
export const SOURCE_ROW = 2
/** ...and must leave through the right edge of this row. */
export const CORE_ROW = 3

/** Sides as bits: up, right, down, left. */
export const N = 1, E = 2, S = 4, W = 8

export type TileKind = "line" | "bend" | "tee" | "cross"

/** Openings of each kind at rotation 0. */
const BASE: Record<TileKind, number> = { line: N | S, bend: N | E, tee: N | E | S, cross: N | E | S | W }

/** Row by row. One route through it exists; the rest are relays that lead nowhere useful. */
export const LAYOUT: TileKind[] = [
  "bend", "tee", "line", "bend", "line",
  "bend", "line", "bend", "tee", "bend",
  "bend", "bend", "line", "line", "tee",
  "line", "tee", "bend", "line", "line",
  "tee", "bend", "line", "bend", "bend",
]

/** Openings of a tile after `rotation` quarter turns clockwise. */
export function openings(kind: TileKind, rotation: number): number {
  let mask = BASE[kind]
  for (let i = 0; i < ((rotation % 4) + 4) % 4; i++) mask = ((mask << 1) | (mask >> 3)) & 15
  return mask
}

/**
 * Indexes of the tiles the signal currently reaches, walking from the source
 * through openings that face each other. `done` is true when it reaches the core.
 */
export function trace(rotations: number[]): { lit: Set<number>; done: boolean } {
  const lit = new Set<number>()
  const start = SOURCE_ROW * COLS
  if (!(openings(LAYOUT[start], rotations[start] ?? 0) & W)) return { lit, done: false }
  const queue = [start]
  lit.add(start)
  let done = false
  const steps: [number, number, number, number][] = [[N, -1, 0, S], [E, 0, 1, W], [S, 1, 0, N], [W, 0, -1, E]]
  while (queue.length) {
    const i = queue.shift()!
    const r = Math.floor(i / COLS), c = i % COLS
    const mask = openings(LAYOUT[i], rotations[i] ?? 0)
    if (r === CORE_ROW && c === COLS - 1 && mask & E) done = true
    for (const [side, dr, dc, facing] of steps) {
      if (!(mask & side)) continue
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue
      const j = nr * COLS + nc
      if (lit.has(j) || !(openings(LAYOUT[j], rotations[j] ?? 0) & facing)) continue
      lit.add(j)
      queue.push(j)
    }
  }
  return { lit, done }
}

/** True for a well-formed answer that routes the signal into the core. */
export function isSolved(rotations: unknown): boolean {
  if (!Array.isArray(rotations) || rotations.length !== LAYOUT.length) return false
  if (!rotations.every((r) => Number.isInteger(r) && r >= 0 && r < 4)) return false
  return trace(rotations as number[]).done
}
