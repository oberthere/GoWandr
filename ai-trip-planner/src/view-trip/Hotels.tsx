import { PlacePhoto } from '@/components/custom/PlacePhoto';
import type { HotelOption } from '@/types/itinerary';

interface Props {
  hotels: HotelOption[];
}

function HotelCard({ hotel }: { hotel: HotelOption }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${hotel.hotelName} ${hotel.hotelAddress}`,
  )}`;

  return (
    <a className="hotel" href={mapsUrl} target="_blank" rel="noreferrer">
      <div className="ph">
        <PlacePhoto query={`${hotel.hotelName} ${hotel.hotelAddress}`} fallback="🏨" />
        {hotel.rating != null && <span className="star">★ {hotel.rating}</span>}
      </div>
      <div className="body">
        <h4>{hotel.hotelName}</h4>
        <div className="desc">{hotel.description}</div>
        {hotel.pricePerNight && (
          <div className="price">{hotel.pricePerNight}</div>
        )}
      </div>
    </a>
  );
}

export function Hotels({ hotels }: Props) {
  if (!hotels?.length) return null;

  return (
    <div className="section">
      <div className="sec-head">
        <h3>Where to stay</h3>
      </div>
      <div className="hotels">
        {hotels.map((hotel, i) => (
          <HotelCard key={i} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
