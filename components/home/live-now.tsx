"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Section } from "@/components/common/section"
import { Button } from "@/components/ui/button"
import { events } from "@/data/events"
import {
  entriesAt,
  formatSlot,
  liveBoard,
  relativeTime,
  type LiveEntry,
  type LiveStatus,
} from "@/data/live"
import { cn } from "@/lib/utils"

/**
 * The live board: what is running on campus, worked out from the clock.
 *
 * The page is statically rendered, so the clock has to be read in the browser
 * — a status baked at build time would be wrong within the hour. Until the
 * first tick lands, every card shows its scheduled slot and no status pill,
 * which is true at any moment and avoids a hydration mismatch.
 *
 * Re-reads the time every 30 seconds, so a card flips on its own while the
 * page sits open on a screen in the hall.
 */

const TICK_MS = 30_000

const statusLabel: Record<LiveStatus, string> = {
  live: "Live now",
  upcoming: "Up next",
  done: "Wrapped",
}

function StatusPill({ status }: { status: LiveStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.22em]",
        status === "live" && "border-primary/50 bg-primary/10 text-primary",
        status === "upcoming" && "border-border bg-background/60 text-muted-foreground",
        status === "done" && "border-border bg-background/60 text-muted-foreground/80",
      )}
    >
      {status === "live" && (
        <span className="animate-beacon h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      )}
      {statusLabel[status]}
    </span>
  )
}

type CardProps = { entry: LiveEntry; status: LiveStatus | null; now: number | null }

function Card({ entry, status, now }: CardProps) {
  const event = events.find((candidate) => candidate.slug === entry.slug)
  const title = entry.label ?? event?.title.trim() ?? entry.slug
  const photos = entry.photos ?? []
  const note =
    status === "upcoming"
      ? (entry.noteBefore ?? entry.note)
      : status === "done"
        ? (entry.noteAfter ?? entry.note)
        : entry.note
  const countdown = status && now !== null ? relativeTime(entry, status, now) : null

  return (
    <article
      className={cn(
        "surface flex flex-col overflow-hidden",
        status === "live" && "border-primary/35",
        status === "done" && "opacity-85",
      )}
    >
      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-snug">{title}</h3>
          {status && <StatusPill status={status} />}
        </div>

        {/* The slot is the one fact that is true whether or not the clock has
            been read yet, so it anchors the card from the first paint. */}
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
          {formatSlot(entry)}
          {countdown && (
            <span className={cn("ml-2", status === "live" ? "text-primary" : "text-foreground/70")}>
              · {countdown}
            </span>
          )}
        </p>

        {note && <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>}

        {event && (
          <Link
            href={`/events/${event.slug}`}
            className="mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary hover:underline"
          >
            Event details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        )}
      </div>

      {photos.length > 0 && (
        <div
          className={cn(
            "grid gap-px border-t border-border bg-border",
            photos.length === 1 ? "grid-cols-1" : "grid-cols-2",
          )}
        >
          {photos.slice(0, 4).map((photo) => (
            <figure key={photo.src} className="relative bg-background">
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 44vw, 90vw"
                />
              </div>
              {photo.caption && (
                <figcaption className="px-3 py-2 text-xs leading-snug text-muted-foreground">
                  {photo.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </article>
  )
}

export function LiveNow() {
  // null until the browser has read its clock — see the note above.
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(id)
  }, [])

  if (!liveBoard.enabled || liveBoard.entries.length === 0) return null

  const entries =
    now === null
      ? liveBoard.entries.map((entry) => ({ ...entry, status: null as LiveStatus | null }))
      : entriesAt(now)

  const liveCount = entries.filter((entry) => entry.status === "live").length
  const nextUp = entries.find((entry) => entry.status === "upcoming")

  const eyebrow =
    now === null
      ? "The board"
      : liveCount > 0
        ? `${liveCount} running right now`
        : nextUp
          ? `Next up · ${nextUp.label ?? nextUp.slug}`
          : "That's a wrap"

  return (
    <Section
      id="live"
      size="wide"
      eyebrow={eyebrow}
      title={
        <span className="inline-flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full",
              liveCount > 0 ? "animate-beacon bg-primary" : "bg-muted-foreground/40",
            )}
            aria-hidden
          />
          Live now
        </span>
      }
      description={liveBoard.lead}
      action={
        <Button asChild variant="outline">
          <Link href="/events">
            All events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      }
      className="border-b border-border bg-primary/[0.02] pt-12 md:pt-16"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {entries.map((entry) => (
          <Card key={entry.slug} entry={entry} status={entry.status} now={now} />
        ))}
      </div>
    </Section>
  )
}
