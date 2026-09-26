import { cn } from "@/lib/utils"

/**
 * Brand lockup: the bug mark above or beside the "cicada" wordmark. Both are
 * static SVGs in public/brand (traced from the original PNGs), so they're
 * cached once and add nothing to the JS bundle.
 */
export const BUG_SRC = "/brand/cicada-bug.svg"
export const WORDMARK_SRC = "/brand/cicada-wordmark.svg"

export function Logo({
  className,
  size = "sm",
}: {
  className?: string
  size?: "sm" | "md"
}) {
  return (
    <span className={cn("flex items-center", size === "sm" ? "gap-2.5" : "gap-3", className)}>
      <img
        src={BUG_SRC}
        alt=""
        aria-hidden
        className={cn("glow w-auto", size === "sm" ? "h-7" : "h-9")}
      />
      <span className="flex flex-col gap-1 leading-none">
        <img
          src={WORDMARK_SRC}
          alt="CICADA"
          className={cn("w-auto", size === "sm" ? "h-[1.15rem]" : "h-6")}
        />
        <span
          className={cn(
            "font-mono tracking-[0.45em] text-muted-foreground",
            size === "sm" ? "text-[0.55rem]" : "text-[0.65rem]",
          )}
        >
          2026
        </span>
      </span>
    </span>
  )
}
