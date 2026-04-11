/** Static gradient + noise texture overlay (no SoftAurora). SVG filter `#advanced-texture` is in site layout. */
export default function TextureSectionBackdrop() {
  return (
    <div
      className="futuristic-pattern opacity-20 absolute top-0 left-0 w-full h-full pointer-events-none"
      aria-hidden
    >
      <span className="ripple-overlay" />
    </div>
  )
}
