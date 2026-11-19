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
4. Put `/in/dashboard` on the projector and click **Arm projector**, bottom
   right. That one click does two things a page cannot do by itself: it puts
   the browser into fullscreen, and it earns the permission that lets the film
   play with sound. After it, the screen shows one dim lamp per guest and
   nothing else.
5. On the host's cue, the guests press. Each lamp lights as its press lands.
6. When the last lamp lights, the wordmark reveals, holds for about three and
   a half seconds, and then the film takes the whole screen, edge to edge.

Keep `/in/inaugration` open on your own laptop through the ceremony — it shows
the same presses as a list, so you can see who has not pressed yet.

## The film

Configured in `data/inauguration.ts`. Two options; the self-hosted file wins
if both are set.

### Self-hosted (preferred)

Drop the film at `public/up/inauguration.mp4`, commit, done. Until that file
exists the reveal still works — the wordmark lands and no video box is shown,
because the page checks the file is there before rendering a player.

It tries to play with sound and falls back to muted if the browser refuses
autoplay. **Arm the projector before the ceremony starts** and sound will be
allowed.

Keep the file under ~50 MB: GitHub warns above 50 MB per file and refuses
above 100 MB. Re-encoding usually gets a 1080p reel well under that with no
visible loss on a projector:

```
ffmpeg -i big.mp4 -c:v libx264 -crf 23 -preset slow -vf scale=1920:-2        -c:a aac -b:a 160k -movflags +faststart public/up/inauguration.mp4
```

### YouTube

For a file too large to keep in the repository. Upload as **Unlisted**, then
in `data/inauguration.ts` set `src: null` and `youtubeId` to the id from the
URL (the part after `v=`).

Weigh this against self-hosting before the day:

- **It cannot autoplay with sound.** YouTube is stricter than a plain `<video>`
  tag; expect to click play, or to start muted.
- **It needs the venue's internet** at the exact moment of the reveal. A
  self-hosted file is already cached by the page.
- **Ads and end screens.** Unlisted videos on a channel without monetisation
  normally show neither, but this is YouTube's call, not yours. `rel=0` keeps
  suggestions to your own channel.
- **It is YouTube-branded.** The title bar and logo appear on the projector.

If the film has to be large, compressing it and self-hosting is the safer
ceremony. Use YouTube when that is not possible.

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
