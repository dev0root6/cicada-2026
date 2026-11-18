/**
 * The live board — what is happening on campus right now.
 *
 * This is the one file to edit during the fest. Flip an event's `status` as
 * the day moves and drop photo filenames into `photos`; everything on the
 * home page follows from here. Set `enabled: false` once the fest is over and
 * the whole section disappears.
 *
 * Photos live in `public/live/<slug>/` — see that folder's README. Paths here
 * are site-absolute, e.g. "/live/hackathon/01.jpg".
 */

export type LiveStatus =
  /** Running right now. */
  | "live"
  /** Starting later today or tomorrow. */
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
  status: LiveStatus
  /** Shown under the title, e.g. "Round 2 under way · Seminar Hall". */
  note?: string
  /** Overrides the event's own title when the board needs something shorter. */
  label?: string
  photos?: LivePhoto[]
}

export const liveBoard = {
  /** Master switch for the whole Live now section. */
  enabled: true,
  /** Small line under the heading. */
  lead: "Updated through the day — what is running right now, and pictures from the floor.",
  entries: [
    {
      slug: "project-expo",
      label: "Project Expo",
      status: "live",
      note: "Judging under way · Seminar Hall",
      photos: [],
    },
    {
      slug: "ipl-auction",
      label: "IPL Auction",
      status: "upcoming",
      note: "Round 1 quiz goes out online",
      photos: [],
    },
    {
      slug: "hackathon",
      label: "Hackathon",
      status: "upcoming",
      note: "Passes sold out · Problem statements drop at 1:00 PM on 20 November",
      photos: [],
    },
    {
      slug: "free-fire",
      label: "Free Fire",
      status: "upcoming",
      note: "Brackets published to registered squads",
      photos: [],
    },
  ] as LiveEntry[],
}

/** Entries in board order: live first, then upcoming, then finished. */
export function sortedLiveEntries(): LiveEntry[] {
  const rank: Record<LiveStatus, number> = { live: 0, upcoming: 1, done: 2 }
  return [...liveBoard.entries].sort((a, b) => rank[a.status] - rank[b.status])
}

/** Every photo on the board, newest events first — used by the strip. */
export function liveGallery(): Array<LivePhoto & { slug: string }> {
  return sortedLiveEntries().flatMap((entry) =>
    (entry.photos ?? []).map((photo) => ({ ...photo, slug: entry.slug })),
  )
}
