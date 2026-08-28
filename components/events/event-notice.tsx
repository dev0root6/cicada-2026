import { AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EventNotice as EventNoticeData } from "@/data/events"

const tones = {
  warning: {
    icon: AlertTriangle,
    wrapper: "border-amber-500/40 bg-amber-500/5",
    accent: "text-amber-400",
  },
  info: {
    icon: Info,
    wrapper: "border-primary/40 bg-primary/5",
    accent: "text-primary",
  },
} as const

export function EventNotice({ notice }: { notice: EventNoticeData }) {
  const tone = tones[notice.tone]
  const Icon = tone.icon

  return (
    <div className={cn("flex gap-3 rounded-xl border p-4", tone.wrapper)}>
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", tone.accent)} aria-hidden />
      <div>
        <p className="font-medium">{notice.title}</p>
        {notice.body && <p className="mt-1 text-sm text-muted-foreground">{notice.body}</p>}
      </div>
    </div>
  )
}
