import { PaymentBadge } from "./payment-badge"
import { formatDateTime, formatRupees } from "@/lib/format"
import type { Registration } from "@/lib/db/types"

export function RegistrationsTable({ registrations }: { registrations: Registration[] }) {
  if (registrations.length === 0) {
    return (
      <div className="surface p-10 text-center">
        <p className="font-medium">No registrations yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Entries appear here as soon as the public event forms start submitting.
        </p>
      </div>
    )
  }

  return (
    <div className="surface overflow-x-auto">
      <table className="w-full min-w-[900px] text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            {["Registered", "Event", "Team", "Contact", "Phone", "Amount", "Status"].map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {registrations.map((registration) => (
            <tr key={registration.id} className="align-top transition-colors hover:bg-accent/30">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                {formatDateTime(registration.createdAt)}
              </td>
              <td className="px-4 py-3 font-mono text-xs">{registration.eventSlug}</td>
              <td className="px-4 py-3">{registration.teamName ?? "—"}</td>
              <td className="px-4 py-3">
                <span className="block font-medium">{registration.contactName}</span>
                <a
                  href={`mailto:${registration.email}`}
                  className="block text-xs text-muted-foreground hover:text-primary"
                >
                  {registration.email}
                </a>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <a
                  href={`tel:${registration.phone.replace(/\s/g, "")}`}
                  className="font-mono text-xs hover:text-primary"
                >
                  {registration.phone}
                </a>
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono tabular-nums">
                {formatRupees(registration.amountPaise)}
              </td>
              <td className="px-4 py-3">
                <PaymentBadge status={registration.paymentStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
