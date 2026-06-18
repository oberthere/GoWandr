import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getTripById } from '@/service/Trips';
import type { TripDoc } from '@/types/itinerary';
import { InfoSection } from './InfoSection';
import { Hotels } from './Hotels';
import { DailyPlan } from './DailyPlan';
import { Footer } from './Footer';

function ViewTrip() {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<TripDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTripData = async () => {
      if (!tripId) return;
      setIsLoading(true);
      try {
        const data = await getTripById(tripId);
        if (!data) {
          toast.error('Trip not found.');
        }
        setTrip(data);
      } catch (err) {
        console.error('[getTripData]', err);
        toast.error('Could not load this trip.');
      } finally {
        setIsLoading(false);
      }
    };
    getTripData();
  }, [tripId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-20 text-center text-muted-foreground">
        Loading your trip…
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-20 text-center">
        <h1 className="text-2xl font-bold">Trip not found</h1>
        <p className="mt-2 text-muted-foreground">
          This trip may have been removed or the link is incorrect.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="space-y-12">
        <InfoSection trip={trip.tripData} selection={trip.userSelection} />
        <Hotels hotels={trip.tripData.hotelOptions} />
        <DailyPlan days={trip.tripData.days} currency={trip.tripData.currency} />
      </div>
      <Footer />
    </div>
  );
}

export default ViewTrip;
