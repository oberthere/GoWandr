import { PlacePhoto } from '@/components/custom/PlacePhoto';
import type { ItineraryDay, ItineraryItem } from '@/types/itinerary';
import { useCurrency } from './CurrencyContext';

interface Props {
  days: ItineraryDay[];
}

function StopCard({ item }: { item: ItineraryItem }) {
  const cur = useCurrency();
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    item.placesQuery || item.name,
  )}`;

  return (
    <div className="stop">
      {item.suggestedTime && <span className="time">{item.suggestedTime}</span>}
      <span className="dot" />
      <a className="stop-card" href={mapsUrl} target="_blank" rel="noreferrer">
        <div className="ph">
          <PlacePhoto query={item.placesQuery || item.name} fallback="📍" />
        </div>
        <div className="c">
          <span className="kicker">{item.type}</span>
          <h5>{item.name}</h5>
          <p>{item.description}</p>
          <div className="facts">
            {item.durationMinutes > 0 && <span className="fact">⏱ {item.durationMinutes} min</span>}
            {item.estimatedCost > 0 ? (
              <span className="fact cost">{cur.format(item.estimatedCost)}</span>
            ) : (
              <span className="fact cost">FREE</span>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}

export function DailyPlan({ days }: Props) {
  const cur = useCurrency();
  if (!days?.length) return null;

  return (
    <div className="section">
      <div className="sec-head">
        <h3>The day, hour by hour</h3>
      </div>

      {days.map((day) => {
        const stops = day.items?.length ?? 0;
        return (
          <div key={day.day}>
            <div className="day-label">
              <span className="d">Day {String(day.day).padStart(2, '0')}</span>
              <h4>{day.theme}</h4>
              <span className="sum">
                ~{cur.format(day.dailyEstimatedCost)} · {stops} stops
              </span>
            </div>
            <div className="timeline">
              {day.items
                ?.slice()
                .sort((a, b) => a.order - b.order)
                .map((item, i) => (
                  <StopCard key={i} item={item} />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
