export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-4 text-center">
      <p className="text-sm font-semibold text-foreground">AI Trip Planner</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Itineraries are AI-generated suggestions: double-check hours, prices, and bookings before you go.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Trip Planner. Built with Gemini & Google Maps.
      </p>
    </footer>
  );
}
