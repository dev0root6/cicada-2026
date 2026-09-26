import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { site } from "@/data/site"
import "./globals.css"

/** Body face — paragraphs, UI copy. */
const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
})

/** Mono face — headings, UI, eyebrows and figures; the teaser's terminal voice. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono-code",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: site.title,
    template: `%s · ${site.title}`,
  },
  description: site.description,
  icons: { icon: "/brand/cicada-bug.svg" },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${body.variable} ${mono.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
