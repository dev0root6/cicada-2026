import "server-only"
import { headers } from "next/headers"
import { mailConfig } from "@/data/emails"

/** The site's own origin for links in emails, from the request that triggered them. */
export async function requestOrigin(): Promise<string> {
  const list = await headers()
  const host = list.get("x-forwarded-host") ?? list.get("host")
  if (!host) return mailConfig.fallbackSiteUrl
  const proto = list.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https")
  return `${proto}://${host}`
}
