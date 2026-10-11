/** Red and blue field behind the entity pages: the opposite of the fest's green. */
export function EntityBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-[#04061a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,rgb(255_59_79/0.28),transparent_55%),radial-gradient(ellipse_at_85%_90%,rgb(61_123_255/0.3),transparent_55%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(61_123_255/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(61_123_255/0.12)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      <div className="absolute inset-0 [background:repeating-linear-gradient(to_bottom,rgb(0_0_0/0.22)_0_1px,transparent_1px_3px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgb(0_0_0/0.7)_100%)]" />
    </div>
  )
}
