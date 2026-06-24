import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PlacePhoto } from '@/components/custom/PlacePhoto';
import { SELECT_BUDGET_OPTIONS } from '@/create-trip/constants';
import { useAuthUser } from '@/service/GoogleAuth';
import { deleteTrip, getUserTrips } from '@/service/Trips';
import type { TripDoc } from '@/types/itinerary';

type SortKey = 'new' | 'old' | 'name';

function TripCard({ trip, onDelete }: { trip: TripDoc; onDelete: (id: string) => void }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const destination = trip.tripData?.destination ?? trip.userSelection?.location?.label ?? 'Trip';
  const days = trip.tripData?.days?.length ?? (Number(trip.userSelection?.noOfDays) || 0);
  const budget = trip.userSelection?.budget;
  const traveler = trip.userSelection?.traveler;
  const badge = destination.split(',').pop()?.trim();

  const closeMenu = () => {
    setMenuOpen(false);
    setConfirming(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="trip h-full w-full"
        onClick={() => navigate(`/view-trip/${trip.id}`, { state: { from: 'trips' } })}
      >
        <div className="ph">
          <PlacePhoto query={`${destination} skyline`} fallbackQuery={destination} fallback="🌆" />
          {badge && <span className="badge">{badge}</span>}
        </div>
        <div className="tbody">
          <h2>{destination.split(',')[0]}</h2>
          <div className="row">
            {days ? `${days} ${days === 1 ? 'day' : 'days'}` : 'Trip'}
            {budget && (
              <>
                <span className="dot-sep" />
                {budget}
              </>
            )}
            {traveler && (
              <>
                <span className="dot-sep" />
                {traveler}
              </>
            )}
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setConfirming(false);
          setMenuOpen((o) => !o);
        }}
        aria-label="Trip options"
        className="absolute right-2.5 top-2.5 z-10 grid h-9 w-9 place-items-center rounded-lg bg-white/90 text-ink shadow-soft backdrop-blur transition hover:bg-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" aria-hidden="true" onClick={closeMenu} />
          <div
            role="menu"
            className="absolute right-3 top-12 z-20 w-44 rounded-xl border border-line bg-surface p-1 shadow-soft"
          >
            {confirming ? (
              <>
                <div className="px-3 py-2 text-sm font-medium text-ink">Delete this trip?</div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onDelete(trip.id);
                    closeMenu();
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Yes, delete
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={closeMenu}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-graphite hover:bg-surface-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                role="menuitem"
                onClick={() => setConfirming(true)}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-graphite hover:bg-surface-2"
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  ariaLabel,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-xs text-graphite outline-none hover:border-line-strong focus:border-ink"
    >
      {children}
    </select>
  );
}

function MyTrips() {
  const user = useAuthUser();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<TripDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortKey>('new');
  const [filterBudget, setFilterBudget] = useState('all');

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        setTrips(await getUserTrips(user.email));
      } catch (err) {
        console.error('[getUserTrips]', err);
        toast.error('Could not load your trips.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const handleDelete = async (id: string) => {
    const prev = trips;
    setTrips((t) => t.filter((x) => x.id !== id)); // optimistic
    try {
      await deleteTrip(id);
      toast.success('Trip deleted.');
    } catch (err) {
      console.error('[deleteTrip]', err);
      setTrips(prev); // roll back
      toast.error('Could not delete the trip.');
    }
  };

  const visible = useMemo(() => {
    let list = trips;
    if (filterBudget !== 'all') {
      list = list.filter((t) => t.userSelection?.budget === filterBudget);
    }
    const sorted = [...list];
    if (sortBy === 'new') sorted.sort((a, b) => Number(b.id) - Number(a.id));
    else if (sortBy === 'old') sorted.sort((a, b) => Number(a.id) - Number(b.id));
    else if (sortBy === 'name')
      sorted.sort((a, b) =>
        (a.tripData?.destination ?? '').localeCompare(b.tripData?.destination ?? ''),
      );
    return sorted;
  }, [trips, sortBy, filterBudget]);

  if (!user) {
    return (
      <div className="mx-auto max-w-[min(1600px,92vw)] px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">My trips</h1>
        <p className="mt-2 leading-relaxed text-muted2">Sign in to view the trips you've generated.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[min(1600px,92vw)] px-6 pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4 pt-15 pb-9">
        <div>
          <span className="eyebrow">Saved</span>
          <h1 className="mt-1.5 mb-2 font-display text-[clamp(2.3rem,5vw,3.5rem)] font-medium tracking-[-0.03em]">
            My trips
          </h1>
          <p className="leading-relaxed text-muted2">
            {isLoading
              ? 'Loading your trips...'
              : trips.length === 0
                ? 'No itineraries yet. Plan your first one.'
                : `${trips.length} ${trips.length === 1 ? 'itinerary' : 'itineraries'}, ready when you are.`}
          </p>
        </div>

        {trips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Select value={filterBudget} onChange={setFilterBudget} ariaLabel="Filter by budget">
              <option value="all">All budgets</option>
              {SELECT_BUDGET_OPTIONS.map((b) => (
                <option key={b.id} value={b.title}>
                  {b.title}
                </option>
              ))}
            </Select>
            <Select value={sortBy} onChange={(v) => setSortBy(v as SortKey)} ariaLabel="Sort trips">
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="name">Destination A–Z</option>
            </Select>
          </div>
        )}
      </div>

      <div className="trips-grid">
        {visible.map((trip) => (
          <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
        ))}
        <button type="button" className="new-trip" onClick={() => navigate('/create-trip')}>
          <span className="plus" aria-hidden="true">+</span>
          Plan a new trip
        </button>
      </div>

      {!isLoading && trips.length > 0 && visible.length === 0 && (
        <p className="mt-8 text-center leading-relaxed text-muted2">No trips match this filter.</p>
      )}
    </div>
  );
}

export default MyTrips;
