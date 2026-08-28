import { cn } from "@/lib/utils"
import type { PaymentStatus } from "@/lib/db/types"

const styles: Record<PaymentStatus, string> = {
  paid: "border-primary/40 bg-primary/10 text-primary",
  pending: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  failed: "border-destructive/40 bg-destructive/10 text-destructive",
  refunded: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  cancelled: "border-border bg-muted text-muted-foreground",
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider",
        styles[status] ?? styles.cancelled,
      )}
    >
      {status}
    </span>
  )
}
