import { BUG_SRC } from "@/components/brand/logo"
import { cn } from "@/lib/utils"
import type { Event } from "@/data/events"

/**
 * An event's cover photo, or — when it has none yet — the bug mark on the
 * perforated grid, so a missing image still reads as on-brand.
 */
export function EventCover({ event, className }: { event: Event; className?: string }) {
  if (event.coverImage) {
    return (
      <img
        src={event.coverImage}
        alt=""
        aria-hidden
        loading="lazy"
        className={cn(
          "h-full w-full",
          event.imageFit === "contain" ? "object-contain" : "object-cover",
          className,
        )}
        style={{ objectPosition: event.imagePosition }}
      />
    )
  }

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full items-center justify-center bg-[radial-gradient(circle,rgb(76_217_123/0.14)_1px,transparent_1.6px)] bg-[length:16px_16px]",
        className,
      )}
    >
      <img src={BUG_SRC} alt="" className="glow w-2/5 max-w-60 opacity-60" />
    </div>
  )
}
