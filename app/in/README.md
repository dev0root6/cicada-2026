# The inauguration ceremony (`/in`)

Three screens that together make the chief guests open the fest: each guest
presses their own button, and when the last one lands, CICADA 2026 is revealed
on the projector.

| Route | Who holds it | What it does |
| --- | --- | --- |
| `/in/inaugration` | Whoever is running the ceremony | Set the number of guests, generate their links, watch presses, reset |
| `/in/<id>` | One chief guest, on their phone | A single button. Pressing it records that guest. |
| `/in/dashboard` | The projector | Blank but for one lamp per guest; reveals CICADA when all have pressed |

The spelling `inaugration` is the URL that was asked for. It is not a typo to
fix — links to it may already be in circulation.

## Running it on the day

1. Open `/in/inaugration`. Enter the passcode if one is set.
2. Type how many chief guests are in the room and press **Generate links**.
   This replaces any earlier codes and clears every press, so do it once,
   before the guests arrive.
3. Copy each link and give it to that guest — WhatsApp, a QR code, or open it
   on a phone you hand them. Each link works for exactly one button.
4. Put `/in/dashboard` on the projector. It shows one dim lamp per guest and
   nothing else.
5. On the host's cue, the guests press. Each lamp lights as its press lands.
6. When the last lamp lights, the wordmark reveals and the film plays.

Keep `/in/inaugration` open on your own laptop through the ceremony — it shows
the same presses as a list, so you can see who has not pressed yet.

## The film

The dashboard plays `public/up/inauguration.mp4` after the reveal. Until that
file exists the reveal still works — the wordmark lands and no video box is
shown, because the page checks whether the file is there before rendering a
player. Drop the film in at that exact path, commit, and it appears.

It tries to play with sound and falls back to muted if the browser refuses
autoplay. Click the projector page once before the ceremony starts and sound
will be allowed.

## Setup

- **Database.** The ceremony needs the Neon database. If `/in/inaugration`
  says the tables are missing, apply the schema from the main admin console
  (`/admin/king/system`), which now includes `inauguration_ceremony` and
  `inauguration_guests`.
- **Passcode.** Set `INAUG_ADMIN_KEY` in the Vercel environment variables to
  require one on `/in/inaugration`. Without it the console still works and
  says in red that it is unprotected — nobody should be locked out of their
  own inauguration by a missing variable, but anyone with the URL could reset
  the ceremony.

## How it behaves under pressure

- **Pressing twice does nothing.** A guest's press is recorded once; a second
  tap, a refresh or a retry on a flaky phone cannot change their timestamp or
  double-count.
- **Release is derived, not stored.** The ceremony is released when every
  guest row has a press, so two guests pressing at the same instant cannot
  release it twice or leave it half-released.
- **Zero guests is not "everyone pressed".** An empty list never reveals.
- **Screens recover on their own.** Every page polls, so one that was asleep,
  reloaded, or opened late catches up within a couple of seconds.
- **A lost phone is survivable.** Generate again for that guest only by
  regenerating the whole set before the ceremony, or just open their link on
  another device — the link is the credential, not the device.

## Rehearsing

Generate the links, press them all, watch the reveal, then use **Clear presses
(keep links)** on the console. The same links keep working, so the guests'
phones do not need to be set up twice.
