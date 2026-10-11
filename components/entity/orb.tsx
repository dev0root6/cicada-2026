import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

/**
 * The entity: a yellow orb that never sits still. Pure CSS, so it costs
 * nothing to render and works on the server. `dead` is how it looks once
 * someone has shut it down.
 */
export function EntityOrb({ size = 120, dead, className }: { size?: number; dead?: boolean; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("entity-orb", dead ? "is-dead" : "entity-drift", className)}
      style={{ "--orb": `${size}px` } as CSSProperties}
    >
      <span className="orb-halo" />
      <span className="orb-rays" />
      <span className="orb-ring" />
      <span className="orb-core" />
    </div>
  )
}
