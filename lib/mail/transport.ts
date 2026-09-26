import "server-only"
import nodemailer, { type Transporter } from "nodemailer"
import { mailConfig } from "@/data/emails"
import { site } from "@/data/site"

/**
 * Gmail over SMTP with an app password.
 *
 *   MAIL_APP_PASSWD  16-character Google app password (spaces are ignored)
 *   MAIL_USER        the Gmail address it belongs to; defaults to the site's
 *                    contact address in data/site.ts
 */

function credentials() {
  const pass = process.env.MAIL_APP_PASSWD?.replace(/\s+/g, "")
  const user = process.env.MAIL_USER?.trim() || site.social.email
  return pass && user ? { user, pass } : null
}

export function isMailConfigured(): boolean {
  return credentials() !== null
}

let transporter: Transporter | null = null

export function getTransport(): Transporter {
  const auth = credentials()
  if (!auth) throw new Error("Email is not configured. Set MAIL_APP_PASSWD (and MAIL_USER).")
  transporter ??= nodemailer.createTransport({
    service: "gmail",
    auth,
    // Reuse a few connections when sending an alert to a whole list.
    pool: true,
    maxConnections: 3,
  })
  return transporter
}

export function fromAddress(): string {
  const auth = credentials()
  return `"${mailConfig.fromName}" <${auth?.user ?? ""}>`
}
