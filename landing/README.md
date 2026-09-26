# CICADA 2026 — landing

A single-screen, atmospheric teaser page. Plain HTML, CSS and vanilla JS: no
build step, no dependencies, ~30 KB gzipped for the page plus ~5 KB of CSS/JS.

```
index.html   Markup, with the bug and wordmark inlined as SVG
styles.css   Theme, background ambience and the intro timeline
main.js      Starts the intro, cipher/decrypt text, skip, clock, grid pings
assets/      Original brand PNGs (favicon / social preview)
vercel.json  Cache headers
```

## Run locally

Any static server works:

```bash
cd landing
python3 -m http.server 4173   # http://localhost:4173
```

## Deploy to Vercel

Import the repository as a new Vercel project and set **Root Directory** to
`landing` and **Framework Preset** to *Other*. No build command or output
directory is needed.

## How it moves

- **Intro (~2.8s):** a breach line opens the frame, the bug traces itself in
  from the body outward, floods with colour and glitches; the wordmark's
  letters scramble as ciphers, then drop into place one by one like tumblers;
  the tagline decrypts last. Skip with the button, any click/tap, or
  Esc/Enter/Space.
- **Ambience:** drifting perforated grid, slow concentric rings, a vault-dial
  tick ring, an occasional surveillance sweep and grid-dot pings. Everything
  animates `transform`/`opacity` only.
- **Reduced motion:** `prefers-reduced-motion: reduce` replaces all of the
  above with a single fade and a static background.
- **No JS:** the final frame renders as-is.

## Editing

- **Copy:** the tagline and sub-line are near the bottom of `index.html`.
- **Logos:** the Atria and IEEE Bangalore Section logos load from Cloudinary.
  To self-host, drop the files in `assets/` and update the two `<img>` tags.
  A logo that fails to load hides itself.
- **Brand marks:** the inline SVGs were traced from
  `assets/cicada_bug.png` and `assets/cicada_wordmark_tall_d_long.png`. The
  wordmark is split into one `<svg>` per letter so each can animate on its own.
- **Colour:** `--green` / `--green-2` at the top of `styles.css`.
