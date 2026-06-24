import { PlacePhoto } from '@/components/custom/PlacePhoto';
import type { HotelOption } from '@/types/itinerary';
import { useCurrency } from './CurrencyContext';

interface Props {
  hotels: HotelOption[];
}

// Hotel prices arrive as freeform strings (e.g. "40000 ISK/night"). Pull out the
// numeric amount (assumed to be in the trip's native currency) so it can follow
// the USD/native toggle; fall back to the raw string if it can't be parsed.
function parseNativePrice(raw: string): { amount: number; perNight: boolean } | null {
  const m = raw.match(/(\d[\d,]*(?:\.\d+)?)\s*([kKmM])?/);
  if (!m) return null;
  let amount = parseFloat(m[1].replace(/,/g, ''));
  if (Number.isNaN(amount)) return null;
  const unit = m[2]?.toLowerCase();
  if (unit === 'k') amount *= 1_000;
  else if (unit === 'm') amount *= 1_000_000;
  return { amount, perNight: /night|nightly/i.test(raw) };
}

function HotelCard({ hotel }: { hotel: HotelOption }) {
  const cur = useCurrency();
  const parsed = hotel.pricePerNight ? parseNativePrice(hotel.pricePerNight) : null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hotel.hotelName} ${hotel.hotelAddress}`,
  )}`;

  return (
    <a className="hotel" href={mapsUrl} target="_blank" rel="noreferrer">
      <div className="ph">
        <PlacePhoto query={`${hotel.hotelName} ${hotel.hotelAddress}`} fallback="🏨" />
        {hotel.rating != null && (
          <span className="star">
            <span aria-hidden="true">★</span> {hotel.rating}
            <span className="sr-only"> out of 5 rating</span>
          </span>
        )}
      </div>
      <div className="body">
        <h3>{hotel.hotelName}</h3>
        <div className="desc">{hotel.description}</div>
        {hotel.pricePerNight && (
          <div className="price">
            {parsed ? `${cur.format(parsed.amount)}${parsed.perNight ? '/night' : ''}` : hotel.pricePerNight}
          </div>
        )}
      </div>
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

export function Hotels({ hotels }: Props) {
  if (!hotels?.length) return null;

  return (
    <div className="section">
      <div className="sec-head">
        <h2>Where to stay</h2>
      </div>
      <div className="hotels">
        {hotels.map((hotel, i) => (
          <HotelCard key={i} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
