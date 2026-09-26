import "server-only"
import { emailTemplates, mailConfig } from "@/data/emails"
import type { Event } from "@/data/events"
import { listPendingInterest, markInterestNotified, summariseInterest } from "@/lib/db/interest"
import { renderEmail } from "./render"
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
