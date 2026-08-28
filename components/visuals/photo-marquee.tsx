import { Marquee } from "@/components/common/marquee"

type PhotoMarqueeProps = {
  images: string[]
  /** Seconds for one full loop. */
  duration?: number
}

/**
 * Gallery strip. Previously a rAF loop with drag handling; now pure CSS, which
 * removed ~120 lines of state and stopped the main thread doing per-frame work.
 */
export function PhotoMarquee({ images, duration = 60 }: PhotoMarqueeProps) {
  return (
    <Marquee duration={duration} gapClassName="gap-4 md:gap-6">
      {images.map((src, index) => (
        <figure
          key={src}
          className="group relative h-52 w-72 shrink-0 overflow-hidden rounded-2xl border border-border md:h-64 md:w-96"
        >
          <img
            src={src}
            alt={`CICADA gallery photo ${index + 1}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
        </figure>
      ))}
    </Marquee>
  )
}
