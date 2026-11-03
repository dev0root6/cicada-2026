import "server-only"
import type { EmailTemplate } from "@/data/emails"
import type { Event } from "@/data/events"

export type RenderedEmail = { subject: string; html: string; text: string }

function escape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

/**
 * Renders a template from data/emails.ts into the site's green-on-black look.
 * Table layout and inline styles only — that's what email clients honour.
 */
export function renderEmail(
  template: EmailTemplate,
  event: Event,
  options: { link: string; logoUrl: string },
): RenderedEmail {
  return renderContent(
    {
      subject: template.subject(event),
      eyebrow: template.eyebrow(event),
      heading: template.heading(event),
      paragraphs: template.paragraphs(event),
      cta: template.cta,
      footer: template.footer,
    },
    options,
  )
}

/** Already-resolved email copy, independent of any one event. */
export type EmailContent = {
  subject: string
  eyebrow: string
  heading: string
  paragraphs: string[]
  cta?: { label: string }
  footer: string
}

export function renderContent(
  content: EmailContent,
  options: { link: string; logoUrl: string },
): RenderedEmail {
  const { subject, eyebrow, heading, paragraphs } = content
  const template = content

  const mono = "'JetBrains Mono','SFMono-Regular',Menlo,Consolas,monospace"
  const sans = "'Plus Jakarta Sans',Helvetica,Arial,sans-serif"

  const body = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font:15px/1.65 ${sans};color:#b9c7be">${escape(p)}</p>`,
    )
    .join("")

  const button = template.cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px"><tr><td style="border-radius:999px;background:#4cd97b">
        <a href="${escape(options.link)}" style="display:inline-block;padding:14px 28px;font:600 12px/1 ${mono};letter-spacing:.18em;text-transform:uppercase;color:#06120a;text-decoration:none">${escape(template.cta.label)} &rarr;</a>
      </td></tr></table>`
    : ""

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>${escape(subject)}</title></head>
<body style="margin:0;padding:0;background:#0a0a0a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a">
    <tr><td align="center" style="padding:40px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border:1px solid rgba(76,217,123,.22);border-radius:18px;background:#0d130f">
        <tr><td style="padding:36px 32px 8px" align="center">
          <img src="${escape(options.logoUrl)}" width="180" alt="CICADA" style="display:block;border:0;width:180px;height:auto">
        </td></tr>
        <tr><td style="padding:24px 32px 32px">
          <p style="margin:0 0 12px;font:11px/1.4 ${mono};letter-spacing:.24em;text-transform:uppercase;color:#4cd97b">// ${escape(eyebrow)}</p>
          <h1 style="margin:0 0 20px;font:700 24px/1.25 ${mono};letter-spacing:.02em;text-transform:uppercase;color:#e8efe9">${escape(heading)}</h1>
          ${body}
          ${button}
        </td></tr>
        <tr><td style="padding:20px 32px 28px;border-top:1px solid rgba(76,217,123,.14)">
          <p style="margin:0;font:12px/1.6 ${sans};color:#6f8076">${escape(template.footer)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  const text = [
    `// ${eyebrow}`,
    "",
    heading.toUpperCase(),
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    ...(template.cta ? [`${template.cta.label}: ${options.link}`, ""] : []),
    "--",
    template.footer,
  ].join("\n")

  return { subject, html, text }
}
