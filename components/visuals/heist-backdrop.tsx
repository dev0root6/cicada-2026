/**
 * Site-wide ambience matching the teaser at "/": perforated grid drifting
 * slowly, concentric rings, a surveillance sweep and the odd grid ping.
 * Pure CSS (see "Heist backdrop" in globals.css) — no JS, nothing to hydrate.
 */

/** Fixed spots so server and client render the same markup. */
const PINGS = [
  { left: "18%", top: "22%", delay: "1s" },
  { left: "76%", top: "16%", delay: "3.5s" },
  { left: "62%", top: "58%", delay: "6s" },
  { left: "27%", top: "71%", delay: "8.2s" },
  { left: "88%", top: "82%", delay: "4.7s" },
]

export function HeistBackdrop() {
  return (
    <div className="heist-bg" aria-hidden>
      <div className="heist-grid" />
      <div className="heist-rings" />
      {PINGS.map((ping) => (
        <span
          key={ping.left + ping.top}
          className="heist-ping"
          style={{ left: ping.left, top: ping.top, animationDelay: ping.delay }}
        />
      ))}
      <div className="heist-scan" />
      <div className="heist-crt" />
      <div className="heist-vignette" />
    </div>
  )
}
