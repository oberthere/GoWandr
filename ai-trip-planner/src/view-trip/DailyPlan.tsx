import { PlacePhoto } from '@/components/custom/PlacePhoto';
import type { ItineraryDay, ItineraryItem } from '@/types/itinerary';

interface Props {
  days: ItineraryDay[];
  currency: string;
}

const TYPE_ICON: Record<string, string> = {
  activity: '📍',
  breakfast: '🥐',
  lunch: '🍽️',
  dinner: '🍷',
  cafe: '☕',
  landmark: '🏛️',
};

function ItemCard({ item, currency }: { item: ItineraryItem; currency: string }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    item.placesQuery || item.name,
  )}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <PlacePhoto
        query={item.placesQuery || item.name}
        fallback={TYPE_ICON[item.type] ?? '📍'}
        className="h-36 w-36 shrink-0 rounded-xl object-cover sm:h-44 sm:w-44"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="font-semibold leading-tight text-foreground group-hover:underline">
            {item.name}
          </h4>
          {item.suggestedTime && (
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {item.suggestedTime}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {item.durationMinutes > 0 && <span>⏱️ {item.durationMinutes} min</span>}
          {item.estimatedCost > 0 && (
            <span>
              💵 {currency} {item.estimatedCost.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}

export function DailyPlan({ days, currency }: Props) {
  if (!days?.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold tracking-tight">Daily plan</h2>
      <div className="space-y-8">
        {days.map((day) => (
          <div key={day.day}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold">
                Day {day.day}
                {day.theme && <span className="text-muted-foreground"> · {day.theme}</span>}
              </h3>
              {day.dailyEstimatedCost > 0 && (
                <span className="text-sm text-muted-foreground">
                  ~{currency} {day.dailyEstimatedCost.toLocaleString()}
                </span>
              )}
            </div>
            <div className="space-y-3">
              {day.items
                ?.slice()
                .sort((a, b) => a.order - b.order)
                .map((item, i) => (
                  <ItemCard key={i} item={item} currency={currency} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
