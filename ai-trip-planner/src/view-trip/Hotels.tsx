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
    <a
      href={mapsUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <PlacePhoto
        query={`${hotel.hotelName} ${hotel.hotelAddress}`}
        fallback="🏨"
        className="h-32 w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight text-foreground group-hover:underline">
            {hotel.hotelName}
          </h3>
          {hotel.rating != null && (
            <span className="shrink-0 rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-700">
              ★ {hotel.rating}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{hotel.hotelAddress}</p>
        <p className="line-clamp-2 text-sm text-muted-foreground">{hotel.description}</p>
        {hotel.pricePerNight && (
          <p className="mt-auto pt-1 text-sm font-medium text-foreground">{hotel.pricePerNight}</p>
        )}
      </div>
    </a>
  );
}

export function Hotels({ hotels }: Props) {
  if (!hotels?.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold tracking-tight">Recommended hotels</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {hotels.map((hotel, i) => (
          <HotelCard key={i} hotel={hotel} />
        ))}
      </div>
    </section>
  );
}
