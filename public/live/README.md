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

## Switching an event's state

In `data/live.ts`, each entry has a `status`:

| status     | shown as                                  |
| ---------- | ----------------------------------------- |
| `live`     | pulsing dot, "Live now", at the top        |
| `upcoming` | "Up next"                                  |
| `done`     | "Wrapped" — stays on the board with photos |

Set `liveBoard.enabled` to `false` to remove the whole section after the fest.
