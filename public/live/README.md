# Live photos

Pictures that appear in the **Live now** section on the home page.

## Adding photos

1. Drop the files into a folder named after the event slug:

   ```
   public/live/project-expo/01.jpg
   public/live/hackathon/01.jpg
   ```

   Slugs are the ones in `data/events.ts`: `hackathon`, `project-expo`,
   `ipl-auction`, `free-fire`.

2. List them in `data/live.ts` under that event's `photos`:

   ```ts
   photos: [
     { src: "/live/project-expo/01.jpg", alt: "A team demoing their robot to the judges" },
     { src: "/live/project-expo/02.jpg", alt: "Visitors at the IoT stalls", caption: "Morning rush" },
   ],
   ```

   `alt` is not optional — it is what a screen reader announces, and what
   shows if the file is missing. Describe what is in the frame.

3. Commit and push. Vercel rebuilds and the photos are live.

## Before you upload

- **Resize.** Anything over ~2000px wide is wasted on a phone. 1600px on the
  long edge, JPEG quality ~80, is plenty — aim for under 400 KB a file.
- **Landscape reads best** in the strip; portrait shots are cropped to fit.
- **Faces:** only post photos of people who are happy to be posted.

## How a card decides it is live

Nothing to switch by hand. Each entry in `data/live.ts` carries the window it
runs in, campus time:

```ts
start: "2026-11-19T10:00:00+05:30",
end:   "2026-11-19T13:00:00+05:30",
```

The board reads the browser's clock every 30 seconds and labels each card:

| when                   | shown as                                     |
| ---------------------- | -------------------------------------------- |
| before `start`         | "Up next", with "in 2h 15m"                   |
| between `start`/`end`  | pulsing dot, "Live now", with "40m left"      |
| after `end`            | "Wrapped" — stays on the board with photos    |

Live cards sort to the top on their own.

The `+05:30` matters: it pins the board to campus time, so a visitor in
another timezone still sees the right status. Don't drop it.

Two notes per entry: `noteBefore` shows until it starts, `note` from then on.

### When the clock is wrong

A session that overran, started early or got pulled — set `override` on that
entry and it ignores the clock until you remove it:

```ts
override: "live",   // or "upcoming" / "done"
```

Set `liveBoard.enabled` to `false` to remove the whole section after the fest.
