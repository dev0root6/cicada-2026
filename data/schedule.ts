import { events } from "./events"

export type ScheduleItem = {
  title: string
  time: string
  /** Links the slot to its /events/<slug> page when the activity has one. */
  slug?: string
}

export type ScheduleDay = {
  label: string
  date: string
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
    date: "Nov 4",
    items: [
      event("project-expo"),
      { title: "Cricket", time: "9:00 AM – 5:00 PM" },
      event("who-am-i"),
      event("bug-off"),
    ],
  },
  {
    label: "Day 2",
    date: "Nov 5",
    items: [
      event("aeromaneuver"),
      { title: "Football", time: "9:00 AM – 5:00 PM" },
      event("agent-arena"),
      event("ipl-auction"),
    ],
  },
  {
    label: "Day 3",
    date: "Nov 6",
    items: [event("hackathon")],
  },
]
