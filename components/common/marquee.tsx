import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = {
  children: ReactNode
  /** One full loop, in seconds. Longer = slower. */
  duration?: number
  gapClassName?: string
  className?: string
}

/**
 * CSS-only infinite marquee. The track is rendered twice and translated by
 * -50%, so the seam is invisible and no JS runs per frame. Pauses on hover and
 * for `prefers-reduced-motion` (see globals.css).
 */
export function Marquee({
  children,
  duration = 40,
  gapClassName = "gap-12 md:gap-20",
  className,
}: MarqueeProps) {
  return (
    <div className={cn("edge-fade overflow-hidden", className)}>
      <div
        className={cn("flex w-max animate-marquee items-center", gapClassName)}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className={cn("flex shrink-0 items-center", gapClassName)}>{children}</div>
        <div className={cn("flex shrink-0 items-center", gapClassName)} aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
