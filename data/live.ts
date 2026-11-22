/**
 * The live board — what is happening on campus, worked out from the clock.
 *
 * Each entry carries the window the event actually runs in, so a card flips
 * to "Live now" at its own start time and to "Wrapped" when it finishes. No
 * one has to sit at a laptop switching labels during the fest.
 *
 * Times are written with an explicit +05:30 offset, so a visitor in another
 * timezone still sees the right thing: the board is anchored to campus time,
 * not to whatever clock the browser happens to be on.
 *
 * Photos live in `public/live/<slug>/` — see that folder's README.
 */

export type LiveStatus =
  /** Running right now. */
  | "live"
  /** Hasn't started yet. */
  | "upcoming"
  /** Finished — kept on the board with its photos. */
  | "done"

export type LivePhoto = {
  src: string
  /** Describes the picture for anyone who cannot see it. Keep it concrete. */
  alt: string
  caption?: string
}

export type LiveEntry = {
  /** Must match a slug in data/events.ts so the card can link to the event. */
  slug: string
  /** Short name for the board; the event's own title is used if omitted. */
  label?: string
  /** When it starts and ends, campus time. Both are ISO with the +05:30 offset. */
  start: string
  end: string
  /** Shown under the title while the event is running or finished. */
  note?: string
  /** Shown under the title before it starts; falls back to `note`. */
  noteBefore?: string
  /** Shown once it has finished; falls back to `note`. */
  noteAfter?: string
  /**
   * Forces a status regardless of the clock — for a session that overran, was
   * pulled, or started early. Clear it once the clock is right again.
   */
  override?: LiveStatus
  photos?: LivePhoto[]
}

export const liveBoard = {
  /** Master switch for the whole Live now section. */
  enabled: true,
  lead: "The board follows the clock — each event goes live at its own start time. Pictures from the floor as they come in.",
  entries: [
    {
      slug: "project-expo",
      label: "Project Expo",
      start: "2026-11-19T10:00:00+05:30",
      end: "2026-11-19T13:00:00+05:30",
      noteBefore: "Seminar Hall · judging from 10:00 AM",
      note: "Judging under way · Seminar Hall",
      noteAfter: "Judged and wrapped · winners announced",
      photos: [],
    },
    {
      slug: "ipl-auction",
      label: "IPL Auction",
      start: "2026-11-19T13:00:00+05:30",
      end: "2026-11-19T17:00:00+05:30",
      noteBefore: "Round 1 quiz online, then the auction on campus",
      note: "Auction room open · Round 2 under way",
      noteAfter: "Auction closed · squads locked in",
      photos: [],
    },
    {
      slug: "free-fire",
      label: "Free Fire",
      start: "2026-11-20T09:00:00+05:30",
      end: "2026-11-20T12:00:00+05:30",
      noteBefore: "Brackets published to registered squads",
      note: "Matches running · last squad standing",
      noteAfter: "Booyah · brackets done",
      photos: [],
    },
    {
      slug: "hackathon",
      label: "Hackathon",
      start: "2026-11-20T10:30:00+05:30",
      end: "2026-11-21T13:00:00+05:30",
      noteBefore: "Registrations closed · problem statements drop at 1:00 PM",
      note: "24 hours on the clock · evaluation from 11:30 AM",
      noteAfter: "24 hours done · projects evaluated",
      photos: [],
    },
  ] as LiveEntry[],
}

/** Where an entry sits relative to a given moment. */
export function statusAt(entry: LiveEntry, now: number): LiveStatus {
  if (entry.override) return entry.override
  const start = Date.parse(entry.start)
  const end = Date.parse(entry.end)
  if (Number.isNaN(start) || Number.isNaN(end)) return "upcoming"
  if (now < start) return "upcoming"
  if (now > end) return "done"
  return "live"
}

/** Board order at a given moment: live first, then what's coming, then done. */
export function entriesAt(now: number): Array<LiveEntry & { status: LiveStatus }> {
  const rank: Record<LiveStatus, number> = { live: 0, upcoming: 1, done: 2 }
  return liveBoard.entries
    .map((entry) => ({ ...entry, status: statusAt(entry, now) }))
    .sort(
      (a, b) =>
        rank[a.status] - rank[b.status] || Date.parse(a.start) - Date.parse(b.start),
    )
}

/**
 * "in 2h 15m" / "in 3 days" for something that hasn't started, "12m left" for
 * something running. Null when there is nothing useful to say.
 */
export function relativeTime(entry: LiveEntry, status: LiveStatus, now: number): string | null {
  const target = status === "live" ? Date.parse(entry.end) : Date.parse(entry.start)
  if (Number.isNaN(target)) return null
  const diff = target - now
  if (diff <= 0) return null

  const minutes = Math.round(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  let span: string
  if (days >= 1) span = `${days} day${days === 1 ? "" : "s"}`
  else if (hours >= 1) span = minutes % 60 === 0 ? `${hours}h` : `${hours}h ${minutes % 60}m`
  else span = `${minutes}m`

  return status === "live" ? `${span} left` : `in ${span}`
}

/**
 * The slot a card shows, campus time: "Thu 19 Nov · 10:00 AM – 1:00 PM", or
 * "Fri 20 Nov, 10:30 AM – Sat 21 Nov, 1:00 PM" when it runs past midnight —
 * an overnight event that printed one date would read as a 2-hour session.
 */
export function formatSlot(entry: LiveEntry): string {
  const TZ = "Asia/Kolkata"
  const start = new Date(entry.start)
  const end = new Date(entry.end)

  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
  })
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
  // en-GB gives "10:00 am"; the rest of the site sets its times in caps.
  const time = (d: Date) => clock.format(d).toUpperCase()

  return day.format(start) === day.format(end)
    ? `${day.format(start)} · ${time(start)} – ${time(end)}`
    : `${day.format(start)}, ${time(start)} – ${day.format(end)}, ${time(end)}`
}
