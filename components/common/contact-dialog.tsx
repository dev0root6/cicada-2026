"use client"

import type { ReactNode } from "react"
import { Mail, Phone } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export type ContactPerson = { name: string; phone: string; role?: string }
export type ContactEmail = { label: string; address: string }

type ContactDialogProps = {
  /** Element that opens the dialog. Omit when driving `open` yourself. */
  trigger?: ReactNode
  title?: string
  description?: string
  people?: ContactPerson[]
  emails?: ContactEmail[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * One dialog for every "who do I call?" surface — footer, event sidebar and
 * the About page all render this instead of hand-rolling their own list.
 */
export function ContactDialog({
  trigger,
  title = "Contact Organizers",
  description = "Feel free to reach out to any of our organizers for assistance:",
  people = [],
  emails = [],
  open,
  onOpenChange,
}: ContactDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          {people.map((person) => (
            <ContactRow
              key={`${person.name}-${person.phone}`}
              href={`tel:${person.phone.replace(/\s/g, "")}`}
              icon={<Phone className="h-4 w-4 text-primary" />}
              title={person.name}
              subtitle={person.phone}
              meta={person.role}
            />
          ))}
          {emails.map((email) => (
            <ContactRow
              key={email.address}
              href={`mailto:${email.address}`}
              icon={<Mail className="h-4 w-4 text-primary" />}
              title={email.label}
              subtitle={email.address}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ContactRow({
  href,
  icon,
  title,
  subtitle,
  meta,
}: {
  href: string
  icon: ReactNode
  title: string
  subtitle: string
  /** Optional line above the value, e.g. the person's role. */
  meta?: string
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-accent/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-medium">{title}</span>
        {meta && (
          <span className="block font-mono text-[0.65rem] uppercase tracking-[0.12em] text-primary">
            {meta}
          </span>
        )}
        <span className="block truncate text-sm text-muted-foreground">{subtitle}</span>
      </span>
    </a>
  )
}
