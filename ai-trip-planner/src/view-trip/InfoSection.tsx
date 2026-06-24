import { PlacePhoto } from '@/components/custom/PlacePhoto';
import type { Itinerary, TripUserSelection } from '@/types/itinerary';
import { useCurrency } from './CurrencyContext';

interface Props {
  trip: Itinerary;
  selection: TripUserSelection;
}

function pace(days: number, stops: number): string {
  if (!days) return 'Easy';
  const perDay = stops / days;
  if (perDay <= 4) return 'Easy';
  if (perDay <= 6) return 'Balanced';
  return 'Packed';
}

export function InfoSection({ trip, selection }: Props) {
  const cur = useCurrency();
  const days = trip.days?.length ?? (Number(selection.noOfDays) || 0);
  const stops = trip.days?.reduce((sum, d) => sum + (d.items?.length ?? 0), 0) ?? 0;

  return (
    <>
      <div className="hero-itin">
        <PlacePhoto
          query={`${trip.destination} skyline`}
          fallbackQuery={trip.destination}
          fallback="🌆"
          maxWidthPx={1600}
        />
        <div className="vig" />
        <div className="cap">
          <span className="eyebrow">Your itinerary</span>
          <h1>{trip.destination}</h1>
        </div>
      </div>

      <div className="ticket">
        <div className="left">
          <span className="eyebrow">The brief</span>
          <p>{trip.tripSummary}</p>
          <div className="meta-chips">
            <span className="chip">
              {days} {days === 1 ? 'DAY' : 'DAYS'}
            </span>
            {selection.budget && <span className="chip">{selection.budget.toUpperCase()}</span>}
            {selection.traveler && <span className="chip">{selection.traveler.toUpperCase()}</span>}
            <span className="chip">{stops} STOPS</span>
          </div>
        </div>
        <div className="stub">
          <div>
            <div className="lab">Pace</div>
            <div className="val">{pace(days, stops)}</div>
          </div>
          {trip.estimatedTotalCost != null && (
            <div className="total">
              <div className="lab">Trip total</div>
              <div className="val">{cur.format(trip.estimatedTotalCost)}</div>
              {cur.canConvert && (
                <div className="mt-2 inline-flex rounded-full border border-line bg-surface-2 p-0.5 font-mono text-[0.66rem]">
                  <button
                    type="button"
                    onClick={() => cur.setDisplay('usd')}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      cur.display === 'usd' ? 'bg-ink text-white' : 'text-muted2 hover:text-ink'
                    }`}
                  >
                    USD
                  </button>
                  <button
                    type="button"
                    onClick={() => cur.setDisplay('native')}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      cur.display === 'native' ? 'bg-ink text-white' : 'text-muted2 hover:text-ink'
                    }`}
                  >
                    {cur.native}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
