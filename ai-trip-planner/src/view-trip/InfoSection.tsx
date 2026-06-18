import { PlacePhoto } from '@/components/custom/PlacePhoto';
import type { Itinerary, TripUserSelection } from '@/types/itinerary';

interface Props {
  trip: Itinerary;
  selection: TripUserSelection;
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-sm font-medium text-foreground/80">
      {children}
    </span>
  );
}

export function InfoSection({ trip, selection }: Props) {
  const days = trip.days?.length ?? selection.noOfDays;

  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      {/* Banner */}
      <div className="relative h-56 w-full sm:h-72">
        <PlacePhoto
          query={trip.destination}
          fallback="🌆"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-8">
          <p className="text-sm font-medium text-white/80">Your itinerary</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-4xl">
            {trip.destination}
          </h1>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 p-6 sm:p-8">
        <p className="text-base leading-relaxed text-muted-foreground">{trip.tripSummary}</p>

        <div className="flex flex-wrap gap-2">
          <Pill>📅 {days} days</Pill>
          {selection.budget && <Pill>💰 {selection.budget}</Pill>}
          {selection.traveler && <Pill>🧳 {selection.traveler}</Pill>}
          {trip.estimatedTotalCost != null && (
            <Pill>
              ~{trip.currency} {trip.estimatedTotalCost.toLocaleString()} total
            </Pill>
          )}
        </div>
      </div>
    </section>
  );
}
