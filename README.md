# CICADA

<div align="center">
<img src="https://res.cloudinary.com/dx9bvma03/image/upload/v1760198155/cicada_logo_no_bg_m0sjov.png" alt="CICADA logo" width="200" height="auto" />
</div>

CICADA is Atria Institute of Technology's annual technology festival — workshops, hackathons,
competitions, tech talks and showcases hosted by clubs across campus.

## Landing teaser

The site opens on a dependency-free teaser in `public/landing/` (see
[`public/landing/README.md`](public/landing/README.md)). `next.config.mjs`
rewrites `/` to it; its **Enter** button leads to the full site at `/home`.

## Getting started

```bash
npm install        # clean resolve — no --legacy-peer-deps needed
npm run dev        # http://localhost:3000
npm run build      # production build (also typechecks)
npm run typecheck  # tsc --noEmit
```

## Project structure

```
app/
  layout.tsx           Fonts, metadata, <html> shell
  globals.css          Design tokens, base type, component & utility layers
  not-found.tsx
  (site)/
    layout.tsx         Navbar + Footer chrome for every public page
    home/page.tsx      Home (/home) — composes the sections in components/home
    events/            Listing + [slug] detail
    about/  terms/  project-expo/

components/
  layout/              Navbar, Footer
  common/              Container, Section, Marquee, InfoPill, ContactDialog
  home/                One file per home-page section
  events/              Card, description renderer, notice, prizes, sidebar
  visuals/             ParticleNetwork, PhotoMarquee
  ui/                  shadcn/ui primitives (only the ones in use; add more with the shadcn CLI)

data/
  site.ts              Fest identity, nav, sponsors, organisers, gallery
  events.ts            Event list — copy, logistics, prizes, contacts
  schedule.ts          Day-by-day timetable on the home page
  emails.ts            Email templates and mail settings
  faq.ts               Home-page FAQ
  standings.ts         Project Expo results
```

### Content lives in `data/`

Pages and components read from `data/` and render generically — there are no
per-event branches in the markup. To change what the site says:

| Change | Edit |
| --- | --- |
| Fest name, year, dates, venue, socials | `data/site.ts` |
| Nav and footer links | `data/site.ts` |
| Sponsors, gallery photos | `data/site.ts` |
| An event's copy, fee, prizes, organisers | `data/events.ts` |
| Day-by-day schedule | `data/schedule.ts` |
| Email copy, subjects, sender name | `data/emails.ts` |
| FAQ entries | `data/faq.ts` |
| Project Expo results | `data/standings.ts` |

Adding an event means appending one object to `events` in `data/events.ts`; its
listing card and `/events/<slug>` page are generated from it.

While an event has no `registerUrl`, its Register buttons lead to
`/events/<slug>/register`, an "opening soon" page that stores emails in the
`registration_interest` table (run `npm run db:migrate` to create it). Set
`registerUrl` once the real form is live and that page redirects to it.

Rolling the site to a new edition is a one-line change to `site.edition` in
`data/site.ts` (plus the year-specific strings in `data/faq.ts`).

## Priority-list emails

The "registration opens soon" page collects emails into `registration_interest`.
With `MAIL_APP_PASSWD` (a Gmail app password) and `MAIL_USER` set:

1. **On sign-up** each new address gets a "you're on the list" email, sent after
   the response so the visitor never waits on Gmail.
2. **When registrations open**, set the event's `registerUrl` in
   `data/events.ts`, deploy, then open **Alerts** in the admin console and press
   **Send alert**. Everyone waiting gets the "registrations are open" email.
   Each address is marked once delivered, so re-sending only reaches whoever is
   still waiting (batches of `mailConfig.alertBatchSize`; Gmail allows ~500/day).

All copy — subjects, headings, paragraphs, button labels, footer, sender name,
reply-to, and an `enabled` switch per email — lives in `data/emails.ts`. The HTML
layout is `lib/mail/render.ts`.

## Cursor, grid trails and the flying bug

`components/visuals/site-effects.tsx` (mounted once in the site layout, so it
survives client-side navigation) and the teaser both load two plain scripts
from `public/brand/`:

- `cicada-cursor.js` — a reticle cursor (dot + trailing ring that grows over
  anything clickable; text fields keep the native I-beam) and trails that light
  up the background grid's dots along the pointer's path. Touch screens keep
  their normal behaviour and get a pulse through the grid on tap.
- `cicada-fly.js` — the bug flies on every page: after the cursor on desktop,
  to taps on touch screens. It rests in the `/home` hero when that's on screen,
  otherwise in the navbar logo (elements marked `data-cicada-home`), and its
  position carries over full page loads via `sessionStorage`.

Both do nothing under `prefers-reduced-motion` (the cursor stays, without lag).

- `cicada-games.js` — desktop only. More than 5 seconds of continuous, erratic
  mouse movement pops a "wanna play with the bug?" prompt (once per visit);
  the footer's **Play with the bug** link opens it any time. Three games use the
  real flying bug: **Catch** (it flees, click it), **Evade** (it hunts the cursor
  and speeds up) and **Grid Heist** (steer it onto vault nodes). Best scores
  are kept in `localStorage`. Twelve seconds into a game (once per visit) it pauses to ask
  whether you weren't supposed to be exploring events, with a **Back to /home**
  button and **One more round** to carry on.

## Design system

A "heist" theme shared with the teaser at `/`: one acid-green accent
(`#4CD97B`) on near-black (`#0A0A0A`), faint green-tinted panels and lines.
Colours are defined once as CSS custom properties in `app/globals.css` and
consumed through Tailwind theme tokens (`bg-card`, `text-primary`,
`border-border`) — avoid hard-coded hex values in components.

Brand: the bug mark and "cicada" wordmark live in `public/brand/` as SVGs
traced from the original PNGs; `components/brand/logo.tsx` is the lockup used
in the navbar and footer.

Background: `components/visuals/heist-backdrop.tsx` renders the teaser's
drifting perforated grid, rings, surveillance sweep and grid pings behind
every public page — CSS only, disabled under `prefers-reduced-motion`.

Typography:

| Role | Face | Token |
| --- | --- | --- |
| Headings, UI, eyebrows, figures | JetBrains Mono | `font-display` / `font-mono` |
| Body copy | Plus Jakarta Sans | `font-sans` |

Shared classes: `.eyebrow` (mono `// label`), `.surface` / `.surface-hover`
(card treatment), `.hud-corners` (surveillance-frame corners), `.glow`,
`.grid-backdrop` (hairline grid), `.edge-fade` (marquee mask).

## Admin: System and Outreach

- **System** (`/admin/king/system`, admins): shows which database tables exist
  and has an **Apply schema** button that runs `lib/db/schema.sql` from inside
  the deployment, so the database can be set up without a local CLI. Also shows
  email status and the `/helloworld` easter egg switch.
- **Outreach** (`/admin/king/outreach`, admins): email pre-registered people,
  either a whole list (everyone, or one event's) or one person. Only two
  messages exist — *Pre-registration update* and *Enrollment invitation*
  (`outreachTemplates` in `data/emails.ts`) — plus an optional short note.
  Every send is logged in `email_log`; a broadcast can skip anyone who got the
  same message in the last 24 hours, so pressing Send again is safe.
- **`/helloworld`**: an unlinked easter egg. It invites the finder to email a
  screenshot to atriacicada@gmail.com for a gift, until an admin marks it
  claimed on the System page.

## Admin dashboard

Protected console at **`/admin/king`** listing registrations per event with their
Cashfree payment status. That URL is both the sign-in screen and the dashboard —
it renders whichever the session calls for, at the same address.

The path segment after `/admin` is a shared secret; keep it out of docs, tickets
and screenshots. `/admin` and every other path beneath it answer with a single
byte-identical page that appears to load forever:

| Request (signed out) | Response |
| --- | --- |
| `/admin`, `/admin/login`, `/admin/<anything>` | identical loading page, `200` |
| `/admin/king/export` and other sub-paths | the same identical loading page |
| `/admin/king` | sign-in form |

Nothing under `/admin` ever issues a redirect. A `Location` header naming a login
URL would hand the secret to the first person who typed `/admin`, so unauthorised
requests are answered in place instead. The decoy is served straight from
`middleware.ts` rather than a React route, because a rendered page carries an RSC
payload embedding the requested path, which would make `/admin` and
`/admin/<guess>` differ byte-for-byte and expose the shape of the routing tree.

Path secrecy only hides the door. Everything behind it is still authenticated
independently.

### Setup

1. Copy `.env.example` to `.env.local`.
2. Generate a session secret and one digest per admin:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # ADMIN_SESSION_SECRET
   npm run hash-password                                                     # ADMIN_USER_<NAME>
   ```

   Each admin is one `ADMIN_USER_<NAME>` variable; the suffix, lowercased, is the
   username. Add or remove admins by adding or removing variables — no code change.

3. Add a database (Vercel &rsaquo; Storage &rsaquo; Neon) and apply the schema:

   ```bash
   npm run db:migrate
   ```

4. Set `CASHFREE_APP_ID` / `CASHFREE_SECRET_KEY`, and point the Cashfree webhook at
   `https://<your-domain>/api/webhooks/cashfree`.

Mirror every variable in Vercel &rsaquo; Settings &rsaquo; Environment Variables.

### How auth works

| Concern | Approach |
| --- | --- |
| Password storage | PBKDF2-SHA256, 210k iterations, per-user salt. Only digests are stored, only in env vars. |
| Session | HMAC-SHA256 signed cookie: `httpOnly`, `secure` in production, `sameSite=lax`, 8h expiry. |
| Route protection | `middleware.ts` on `/admin/:path*` serves the decoy to unauthorised requests; the page re-checks the session itself. |
| Brute force | In-memory throttle, 8 failures per IP per 15 min. Best-effort only — see `lib/auth/rate-limit.ts`. |
| Enumeration | Same error and same PBKDF2 cost whether the user exists or not. |

Digests are colon-delimited (`pbkdf2:210000:…`) rather than `$`-delimited on
purpose: Next.js runs dotenv-expand over `.env` files, so a `$` in a value is
treated as variable interpolation and silently truncates it.

### Registration flow

```
public form -> POST /api/registrations   -> row written (pending) + Cashfree order
                                         -> browser completes Cashfree checkout
Cashfree    -> POST /api/webhooks/cashfree -> signature verified -> status updated
```

The amount is read from `data/events.ts` server-side, never from the request, so a
caller cannot choose their own price. Payment status is only ever changed by the
signed webhook — never by the browser redirect, which is trivially forged.

## Tech stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui + Radix
- **Fonts**: `next/font/google`
- **Deployment**: Vercel

## License

MIT — see [LICENSE](LICENSE).
