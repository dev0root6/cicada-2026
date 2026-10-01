import "server-only"
import { emailTemplates, mailConfig, outreachTemplates, type OutreachKind } from "@/data/emails"
import { events } from "@/data/events"
import { logEmails } from "@/lib/db/email-log"
import type { PreRegistered } from "@/lib/db/interest"
import type { Event } from "@/data/events"
import { listPendingInterest, markInterestNotified, summariseInterest } from "@/lib/db/interest"
import { renderContent, renderEmail } from "./render"
import { fromAddress, getTransport, isMailConfigured } from "./transport"

// Gmail and most clients don't render SVG, so emails use the PNG wordmark.
const LOGO_PATH = "/landing/assets/cicada_wordmark_tall_d_long.png"

function absolute(siteUrl: string, path: string): string {
  return new URL(path, siteUrl || mailConfig.fallbackSiteUrl).toString()
}

/** "You're on the list" — best effort; a failure never blocks the sign-up. */
export async function sendSignupConfirmation(event: Event, email: string, siteUrl: string) {
  const template = emailTemplates.signupConfirmation
  if (!template.enabled || !isMailConfigured()) return

  const message = renderEmail(template, event, {
    link: absolute(siteUrl, `/events/${event.slug}`),
    logoUrl: absolute(siteUrl, LOGO_PATH),
  })

  try {
    await getTransport().sendMail({
      from: fromAddress(),
      replyTo: mailConfig.replyTo,
      to: email,
      ...message,
    })
  } catch (error) {
    console.error("signup confirmation email failed", error)
  }
}

export type AlertResult = { sent: number; failed: number; remaining: number }

/**
 * Emails everyone waiting on `event` that registrations are open, one batch at
 * a time (mailConfig.alertBatchSize). Each address is marked as notified only
 * once its email is accepted, so a partial run can simply be repeated.
 */
export async function sendRegistrationOpenAlert(event: Event, siteUrl: string): Promise<AlertResult> {
  const template = emailTemplates.registrationOpen
  if (!template.enabled) throw new Error("The registration-open email is disabled in data/emails.ts.")
  if (!event.registerUrl) throw new Error("Set this event's registerUrl in data/events.ts first.")

  const message = renderEmail(template, event, {
    link: absolute(siteUrl, event.registerUrl),
    logoUrl: absolute(siteUrl, LOGO_PATH),
  })

  const batch = await listPendingInterest(event.slug, mailConfig.alertBatchSize)
  const transport = getTransport()

  const results = await Promise.allSettled(
    batch.map((row) =>
      transport
        .sendMail({ from: fromAddress(), replyTo: mailConfig.replyTo, to: row.email, ...message })
        .then(() => row.id),
    ),
  )

  const delivered = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))
  const failed = results.length - delivered.length
  if (failed) {
    const reasons = results.flatMap((r) => (r.status === "rejected" ? [String(r.reason)] : []))
    console.error(`registration alert: ${failed} failed for ${event.slug}`, reasons.slice(0, 3))
  }
  await markInterestNotified(delivered)

  const summary = await summariseInterest()
  const remaining = summary.find((s) => s.eventSlug === event.slug)?.waiting ?? 0
  return { sent: delivered.length, failed, remaining }
}

/** "A", "A and B", "A, B and C". */
function eventNames(slugs: string[]): string {
  const names = slugs
    .map((slug) => events.find((e) => e.slug === slug)?.title.trim())
    .filter((name): name is string => Boolean(name))
  if (!names.length) return "CICADA 2026"
  if (names.length === 1) return names[0]
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
}

export type OutreachResult = { sent: number; failed: number; failedTo: string[] }

/**
 * Sends one of the fixed outreach emails (data/emails.ts) to pre-registered
 * people, each naming the events they signed up for, plus an optional short
 * note from the team. Every delivered email is written to email_log.
 */
export async function sendOutreach(input: {
  kind: OutreachKind
  recipients: PreRegistered[]
  note?: string
  siteUrl: string
  sentBy: string
}): Promise<OutreachResult> {
  const template = outreachTemplates[input.kind]
  const transport = getTransport()
  const note = input.note?.trim()
  const delivered: PreRegistered[] = []
  const failedTo: string[] = []

  // Small waves keep Gmail happy and stay well inside the function time limit.
  for (let i = 0; i < input.recipients.length; i += 10) {
    const wave = input.recipients.slice(i, i + 10)
    const results = await Promise.allSettled(
      wave.map((person) => {
        const message = renderContent(
          {
            subject: template.subject,
            eyebrow: template.eyebrow,
            heading: template.heading,
            paragraphs: [
              ...template.paragraphs(eventNames(person.events)),
              ...(note ? [`A note from the team: ${note}`] : []),
            ],
            cta: { label: template.cta.label },
            footer: template.footer,
          },
          {
            link: absolute(input.siteUrl, template.cta.path),
            logoUrl: absolute(input.siteUrl, LOGO_PATH),
          },
        )
        return transport.sendMail({
          from: fromAddress(),
          replyTo: mailConfig.replyTo,
          to: person.email,
          ...message,
        })
      }),
    )
    results.forEach((r, j) => (r.status === "fulfilled" ? delivered.push(wave[j]) : failedTo.push(wave[j].email)))
  }

  if (failedTo.length) console.error(`outreach ${input.kind}: ${failedTo.length} failed`)
  await logEmails(
    delivered.map((person) => ({
      kind: input.kind,
      recipient: person.email,
      note: note || null,
      sentBy: input.sentBy,
    })),
  )
  return { sent: delivered.length, failed: failedTo.length, failedTo }
}
