import { events } from "./events"

export type ScheduleItem = {
  title: string
  time: string
  /** Links the slot to its /events/<slug> page when the activity has one. */
  slug?: string
}

export type ScheduleDay = {
  label: string
  /** Omitted until the schedule is announced; the day ordering still holds. */
  date?: string
  items: ScheduleItem[]
}

/** A registrable event's slot — title and time come from data/events.ts. */
function event(slug: string): ScheduleItem {
  const match = events.find((e) => e.slug === slug)
  if (!match) throw new Error(`Schedule references unknown event "${slug}"`)
  return { title: match.title.trim(), time: match.time ?? match.Duration, slug }
}

export const schedule: ScheduleDay[] = [
  {
    label: "Day 1",
    date: "Nov 19",
    items: [event("project-expo"), event("ipl-auction")],
  },
  {
    label: "Day 2",
    date: "Nov 20",
    items: [
      event("free-fire"),
      event("hackathon"),
      { title: "Movie show — all night", time: "5:30 PM – 7:30 AM" },
    ],
  },
  {
    label: "Day 3",
    date: "Nov 21",
    items: [{ title: "Hackathon finale — judging and results", time: "Through the morning" }],
  },
]
