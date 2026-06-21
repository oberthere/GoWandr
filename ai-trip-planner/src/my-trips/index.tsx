import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { PlacePhoto } from '@/components/custom/PlacePhoto';
import { useAuthUser } from '@/service/GoogleAuth';
import { getUserTrips } from '@/service/Trips';
import type { TripDoc } from '@/types/itinerary';

function TripCard({ trip }: { trip: TripDoc }) {
  const destination = trip.tripData?.destination ?? trip.userSelection?.location?.label ?? 'Trip';
  const days = trip.tripData?.days?.length ?? trip.userSelection?.noOfDays;
  const budget = trip.userSelection?.budget;

  return (
    <Link
      to={`/view-trip/${trip.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <PlacePhoto query={destination} fallback="🌆" className="h-40 w-full object-cover" />
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-semibold leading-tight text-foreground group-hover:underline">
          {destination}
        </h3>
        <p className="text-sm text-muted-foreground">
          {days ? `${days} days` : 'Trip'}
          {budget ? ` · ${budget}` : ''}
        </p>
      </div>
    </Link>
  );
}

function MyTrips() {
  const user = useAuthUser();
  const [trips, setTrips] = useState<TripDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <p className="mt-2 text-muted-foreground">Sign in to view the trips you've generated.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">My Trips</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading your trips…</p>
      ) : trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">You haven't generated any trips yet.</p>
          <Link
            to="/create-trip"
            className="mt-4 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
          >
            Plan a trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;
