import { site } from "./site"
import { feeAnnounced, type Event } from "./events"

/**
 * Everything the site emails, in one place. Edit copy, subjects and the
 * sender name here; lib/mail renders it into the themed HTML layout and a
 * plain-text twin, and sends it through Gmail (see .env.example).
 *
 * `{link}` in a template is where the call-to-action button goes.
 */

export const mailConfig = {
  /** Display name on the From line. The address is MAIL_USER. */
  fromName: `${site.title}`,
  /** Where replies go. Leave undefined to reply to MAIL_USER. */
  replyTo: site.social.email as string | undefined,
  /** Absolute base for links in emails when the request host is unknown. */
  fallbackSiteUrl: "https://cicada-2026.vercel.app",
  /** Most emails sent per click of "Send alert" (Gmail allows ~500/day). */
  alertBatchSize: 100,
}

export type EmailTemplate = {
  /** Set to false to stop sending this email without touching code paths. */
  enabled: boolean
  subject: (event: Event) => string
  /** Small label above the heading. */
  eyebrow: (event: Event) => string
  heading: (event: Event) => string
  /** One entry per paragraph. */
  paragraphs: (event: Event) => string[]
  cta?: { label: string }
  footer: string
}

export const emailTemplates = {
  /** Sent right after someone asks to be notified on an event's register page. */
  signupConfirmation: {
    enabled: true,
    subject: (event) => `You're on the list — ${event.title.trim()}`,
    eyebrow: () => `${site.title} // priority list`,
    heading: () => "You're on the list.",
    paragraphs: (event) => [
      `We've saved your spot on the priority list for ${event.title.trim()}.`,
      "Registrations aren't open yet. The moment they are, you'll hear from us first — before we announce it anywhere else.",
      "Nothing else to do for now. Keep this inbox close.",
    ],
    cta: { label: "View the event" },
    footer: `You're receiving this because you asked to be notified about ${site.title}. If that wasn't you, ignore this email and you won't hear from us again.`,
  },

  /** Sent from the admin console when an event's registrations open. */
  registrationOpen: {
    enabled: true,
    subject: (event) => `Registrations are open — ${event.title.trim()}`,
    eyebrow: () => `${site.title} // priority alert`,
    heading: () => "The vault is open.",
    paragraphs: (event) => [
      `Registrations for ${event.title.trim()} are now live, and you're hearing it first.`,
      `${event.date.trim()}${event.time ? ` · ${event.time}` : ""} · ${event.venue}. ${event.teamSize}${feeAnnounced(event) ? `, ${event.registrationFee}` : ""}.`,
      "Spots are limited — lock yours in before the word gets out.",
    ],
    cta: { label: "Register now" },
    footer: `You're receiving this because you joined the priority list for ${site.title}. This is a one-time alert for this event.`,
  },
} satisfies Record<string, EmailTemplate>

export type EmailTemplateName = keyof typeof emailTemplates

/**
 * The only emails the admin Outreach page can send, and only to people on a
 * pre-registration list: an update on their pre-registration, or an invitation
 * to enroll. Admins can add a short plain-text note; everything else is fixed
 * here. `{events}` in the copy becomes the event names the person signed up for.
 */
export type OutreachKind = "pre-registration" | "enrollment"

export type OutreachTemplate = {
  /** Shown in the admin console. */
  label: string
  description: string
  subject: string
  eyebrow: string
  heading: string
  paragraphs: (events: string) => string[]
  cta: { label: string; path: string }
  footer: string
}

export const outreachTemplates: Record<OutreachKind, OutreachTemplate> = {
  "pre-registration": {
    label: "Pre-registration update",
    description: "Confirms they're still on the priority list and keeps them warm until registrations open.",
    subject: `Your ${site.title} pre-registration`,
    eyebrow: `${site.title} // pre-registration`,
    heading: "You're still on the list.",
    paragraphs: (events) => [
      `Thanks for pre-registering for ${events}. Your spot on the priority list is safe.`,
      "We're putting the final pieces in place. When registrations open, you'll hear from us before anyone else.",
      "Until then, keep an eye on this inbox.",
    ],
    cta: { label: "Explore the events", path: "/events" },
    footer: `You're receiving this because you pre-registered for ${site.title}. If that wasn't you, ignore this email.`,
  },
  enrollment: {
    label: "Enrollment invitation",
    description: "Invites them to enroll and be part of the fest.",
    subject: `Be part of ${site.title} — enroll now`,
    eyebrow: `${site.title} // enrollment`,
    heading: "Your seat at the table.",
    paragraphs: (events) => [
      `You pre-registered for ${events}, and now it's time to make it official.`,
      `Enroll to lock in your place at ${site.title}: three days of building, breaking and competing at ${site.venue.name}.`,
      "Spots are limited, and priority-list members get first pick.",
    ],
    cta: { label: "Enroll now", path: "/events" },
    footer: `You're receiving this because you pre-registered for ${site.title}. If that wasn't you, ignore this email.`,
  },
}

export const OUTREACH_KINDS = Object.keys(outreachTemplates) as OutreachKind[]
