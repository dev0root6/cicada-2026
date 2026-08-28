import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type InfoPillProps = {
  icon?: LucideIcon
  label: string
  className?: string
}

export function InfoPill({ icon: Icon, label, className }: InfoPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-accent/40 px-3 py-1.5 text-xs font-medium text-foreground/90",
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-primary" aria-hidden />}
      {label}
    </span>
  )
}
