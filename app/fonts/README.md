Self-hosted copies of the site's two typefaces, latin subset, from Fontsource
(@fontsource/jetbrains-mono 5.0.20, @fontsource/plus-jakarta-sans 5.0.21).
Both are licensed under the SIL Open Font License 1.1.

They live in the repo so builds never depend on downloading from Google Fonts,
which intermittently failed `next build` (locally and on Vercel).
