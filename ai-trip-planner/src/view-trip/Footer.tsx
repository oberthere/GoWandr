export function Footer() {
  return (
    <footer className="mx-auto mt-20 max-w-[min(1600px,92vw)] border-t border-line px-6 pt-8.5 text-center text-muted2">
      <div className="font-display text-[1.02rem] font-medium tracking-[-0.02em] text-graphite">
        Itineraries are drafts, not gospel.
      </div>
      <div className="mt-2 font-mono text-[0.72rem] tracking-[0.04em]">
        DOUBLE-CHECK HOURS, PRICES &amp; BOOKINGS · © {new Date().getFullYear()} WAYFARE · BUILT
        WITH GEMINI + GOOGLE MAPS
      </div>
    </footer>
  );
}
