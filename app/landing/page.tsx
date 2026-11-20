import type { Metadata } from "next"

import { events } from "@/data/events"
import { LandingShow } from "./show"

export const metadata: Metadata = {
  title: "CICADA 2026",
  description: "CICADA 2026 — the annual tech fest of Atria Institute of Technology.",
}

/**
 * The standing display: an intro, then every event in turn, looping.
 *
 * Built to be left running on a screen — a foyer monitor, a stall laptop, a
 * projector between sessions — so it never needs a click and never ends.
 */

/** Strips the markup and the decorative bullets out of an event's long copy. */
function plain(description: string): string[] {
  return description
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

/** The first couple of real sentences, for the panel's lead. */
function lead(description: string): string {
  const paragraphs = plain(description).filter(
    (line) => !/^[•🥇🥈🤖🌐🔐⚙️🌱📊💻🥞🍪💬🎮🎯👥🏆]/u.test(line) && line.length > 60,
  )
  return paragraphs[0] ?? plain(description)[0] ?? ""
}

/** The bulleted lines — the "what you actually get" of each event. */
function points(description: string): string[] {
  return plain(description)
    .filter((line) => /^[•🥇🥈🤖🌐🔐⚙️🌱📊💻🥞🍪💬]/u.test(line))
    .map((line) => line.replace(/^[•\s]+/u, "").trim())
    .slice(0, 6)
}

export default function LandingPage() {
  const panels = events.map((event) => ({
    slug: event.slug,
    title: event.title.trim(),
    summary: event.summary,
    lead: lead(event.description),
    points: points(event.description),
    poster: event.coverImage ?? null,
    date: event.date?.trim() ?? "Date to be announced",
    time: event.time?.trim() ?? event.Duration.trim(),
    teamSize: event.teamSize,
    fee: event.registrationFee,
    mode: event.mode ?? "On campus",
    soldOut: Boolean(event.soldOut),
    prizes: (event.prizes ?? []).map((prize) => ({ label: prize.label, amount: prize.amount })),
  }))

  return <LandingShow panels={panels} />
}
