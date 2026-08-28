import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type ContainerProps = {
  children: ReactNode
  /** `wide` for grids, `default` for most sections, `narrow` for long-form copy. */
  size?: "wide" | "default" | "narrow"
  className?: string
}

const sizes = {
  wide: "max-w-7xl",
  default: "max-w-6xl",
  narrow: "max-w-3xl",
} as const

export function Container({ children, size = "default", className }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-5 md:px-8", sizes[size], className)}>{children}</div>
  )
}
