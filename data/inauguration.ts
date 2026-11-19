/**
 * The film that plays on /in/dashboard the moment CICADA is released.
 *
 * Two ways to supply it. Self-hosting is preferred for a live ceremony — see
 * the trade-offs in app/in/README.md — but a YouTube embed is supported for a
 * file too large to keep in the repository.
 *
 * If both are set, the self-hosted file wins.
 */

export const inaugurationFilm = {
  /**
   * A file in public/. The dashboard checks it exists before rendering a
   * player, so leaving this pointing at a missing file is harmless.
   */
  src: null as string | null,

  /**
   * YouTube video id — the part after `v=` or after `youtu.be/`.
   * For https://www.youtube.com/watch?v=dQw4w9WgXcQ that is "dQw4w9WgXcQ".
   * Set `src` to null to use this.
   */
  youtubeId: "2IKQO3UsY_M" as string | null,

  /** Start the film this many seconds in. YouTube only. */
  startAt: 0,
}
