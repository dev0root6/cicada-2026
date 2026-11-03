import { site } from "./site"
import type { Event } from "./events"

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
  /** Where replies go. Undefined means replies land on MAIL_USER. */
  replyTo: undefined as string | undefined,
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
      `${event.date.trim()}${event.time ? ` · ${event.time}` : ""} · ${event.venue}. ${event.teamSize}, ${event.registrationFee}.`,
      "Spots are limited — lock yours in before the word gets out.",
    ],
    cta: { label: "Register now" },
    footer: `You're receiving this because you joined the priority list for ${site.title}. This is a one-time alert for this event.`,
  },
} satisfies Record<string, EmailTemplate>

export type EmailTemplateName = keyof typeof emailTemplates
