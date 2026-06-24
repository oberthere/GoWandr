import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getTripById } from '@/service/Trips';
import type { TripDoc } from '@/types/itinerary';
import { CurrencyProvider } from './CurrencyContext';
import { InfoSection } from './InfoSection';
import { Hotels } from './Hotels';
import { DailyPlan } from './DailyPlan';

function ViewTrip() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [trip, setTrip] = useState<TripDoc | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const from = (location.state as { from?: string } | null)?.from;
  const backLabel = from === 'trips' ? 'All trips' : 'Back to plan';
  const goBack = () => navigate(from === 'trips' ? '/my-trips' : '/create-trip');

  useEffect(() => {
    const getTripData = async () => {
      if (!tripId) return;
      setIsLoading(true);
      try {
        const data = await getTripById(tripId);
        if (!data) toast.error('Trip not found.');
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
      <div className="mx-auto max-w-[min(1600px,92vw)] px-6 py-20 text-center font-mono text-sm text-muted2">
        Loading your trip...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-[min(1600px,92vw)] px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Trip not found</h1>
        <p className="mt-2 text-muted2">This trip may have been removed or the link is incorrect.</p>
      </div>
    );
  }

  return (
    <CurrencyProvider native={trip.tripData.currency}>
      <div className="mx-auto max-w-[min(1600px,92vw)] px-6 pb-24">
        <div className="backbar">
          <button type="button" className="back" onClick={goBack}>
            ← <span>{backLabel}</span>
          </button>
          <span className="save-pill">✓ Saved to my trips</span>
        </div>

        <InfoSection trip={trip.tripData} selection={trip.userSelection} />
        <Hotels hotels={trip.tripData.hotelOptions} />
        <DailyPlan days={trip.tripData.days} />
      </div>
    </CurrencyProvider>
  );
}

export default ViewTrip;
