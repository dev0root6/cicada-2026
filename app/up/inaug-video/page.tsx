import type { Metadata } from "next"

import { InaugVideo } from "./player"

/**
 * The inauguration reel, on its own page.
 *
 * Deliberately outside the (site) route group: this is meant to be thrown on
 * a projector or a hall screen, so it gets the whole viewport with no header,
 * no footer and nothing to scroll. The file itself stays fetchable at
 * /up/inaug-video.mp4 for anyone who wants to download it and play it offline.
 */

export const metadata: Metadata = {
  title: "Inauguration reel",
  description: "CICADA 2026 — the inauguration reel, on loop.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "CICADA 2026 — Inauguration reel",
    description: "CICADA 2026 — the inauguration reel, on loop.",
    images: [{ url: "/up/inaug-video-poster.jpg", width: 1280, height: 720 }],
  },
}

export default function InaugVideoPage() {
  return <InaugVideo />
}
