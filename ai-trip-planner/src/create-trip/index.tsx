import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GeneratingOverlay } from '@/components/custom/GeneratingOverlay';
import { PlacesAutocomplete } from '@/components/ui/PlacesAutocomplete';
import { generateItinerary } from '@/service/itinerary';
import { getStoredUser } from '@/service/GoogleAuth';
import { db } from '@/service/firebaseConfig';
import type { Itinerary } from '@/types/itinerary';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { MAX_TRIP_DAYS, SELECT_BUDGET_OPTIONS, SELECT_TRAVEL_LIST } from './constants';
import OptionCard from './OptionCard';
import { SignInDialog } from './SignInDialog';
import type { TripFormData } from './types';

function CreateTrip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TripFormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleInputChange = <K extends keyof TripFormData>(name: K, value: TripFormData[K]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSaveAiTrip = async (tripData: Itinerary): Promise<string | undefined> => {
    const user = getStoredUser();
    if (!user) return undefined;

    setIsSaving(true);
    try {
      const docId = Date.now().toString();
      await setDoc(doc(db, 'AITrips', docId), {
        userSelection: formData,
        tripData,
        userEmail: user.email,
        id: docId,
      });
      return docId;
    } catch (err) {
      console.error('[onSaveAiTrip]', err);
      toast.error('Could not save your trip.');
      return undefined;
    } finally {
      setIsSaving(false);
    }
  };

  const generateTrip = async () => {
    const { location, noOfDays, budget, traveler } = formData;
    if (!location || !noOfDays || !budget || !traveler) return;

    setIsLoading(true);
    try {
      const itinerary = await generateItinerary({
        location: location.label,
        days: noOfDays,
        budget,
        travelers: traveler,
      });
      setShowSignIn(false);
      const docId = await onSaveAiTrip(itinerary);
      toast.success('Your trip is ready!');
      if (docId) navigate(`/view-trip/${docId}`, { state: { from: 'plan' } });
    } catch (err) {
      console.error('[generateTrip]', err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('429') || message.toLowerCase().includes('quota')) {
        toast.error('Too many requests. Please wait a minute and try again.');
      } else {
        toast.error('Failed to generate trip. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onGenerateTrip = () => {
    const { location, noOfDays, budget, traveler } = formData;

    if (!location || !noOfDays || !budget || !traveler) {
      toast.error('Please fill in all fields before generating.');
      return;
    }
    if (Number(noOfDays) < 1) {
      toast.error('Trip length must be at least 1 day.');
      return;
    }
    if (Number(noOfDays) > MAX_TRIP_DAYS) {
      toast.error(`Maximum trip length is ${MAX_TRIP_DAYS} days.`);
      return;
    }

    if (!getStoredUser()) {
      setShowSignIn(true);
      return;
    }

    generateTrip();
  };

  return (
    <div className="mx-auto max-w-[min(1600px,92vw)] px-6 pb-8">
      {/* Plan head */}
      <div className="max-w-165 pt-16 pb-10">
        <span className="eyebrow">Build a trip</span>
        <h1 className="mt-3.5 mb-4 font-display text-[clamp(2.3rem,5vw,3.5rem)] font-medium leading-[1.04] tracking-[-0.03em]">
          Tell us how you like to{' '}
          <span className="border-b-[3px] border-ink pb-px">travel.</span>
        </h1>
        <p className="max-w-[48ch] text-[1.08rem] leading-relaxed text-graphite">
          A few details is all it takes. We'll draft a day-by-day plan with places to stay, eat,
          and explore, costed and timed.
        </p>
      </div>

      {/* Destination + days */}
      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-[2fr_1fr]">
        <div className="mb-9">
          <label
            htmlFor="destination"
            className="mb-1 block font-display text-[1.2rem] font-semibold tracking-[-0.02em]"
          >
            Where to?
          </label>
          <div className="mb-3.5 text-[0.9rem] text-muted2">A city, a region, or a whole country.</div>
          <PlacesAutocomplete
            id="destination"
            onChange={(v) => {
              if (v) handleInputChange('location', v);
            }}
            placeholder="Search a destination, try Shenzhen or Lisbon"
          />
        </div>
        <div className="mb-9">
          <label
            htmlFor="days"
            className="mb-1 block font-display text-[1.2rem] font-semibold tracking-[-0.02em]"
          >
            How many days?
          </label>
          <div className="mb-3.5 text-[0.9rem] text-muted2">We'll pace it for you.</div>
          <Input
            id="days"
            placeholder="e.g. 3"
            className="h-13 px-4 text-[1.05rem] md:text-[1.05rem]"
            type="number"
            min={1}
            max={MAX_TRIP_DAYS}
            step={1}
            inputMode="numeric"
            value={formData.noOfDays ?? ''}
            onChange={(e) => {
              // Whole numbers only, no leading zeros; allow empty so it can be cleared/retyped.
              const digits = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
              handleInputChange('noOfDays', digits);
            }}
          />
        </div>
      </div>

      {/* Budget */}
      <div className="mb-9">
        <div
          id="budget-label"
          className="mb-1 block font-display text-[1.2rem] font-semibold tracking-[-0.02em]"
        >
          What's the budget like?
        </div>
        <div className="mb-3.5 text-[0.9rem] text-muted2">
          Sets the tier for stays, food, and activities.
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="group" aria-labelledby="budget-label">
          {SELECT_BUDGET_OPTIONS.map((item) => (
            <OptionCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              selected={formData.budget === item.title}
              onClick={() => handleInputChange('budget', item.title)}
            />
          ))}
        </div>
      </div>

      {/* Traveler */}
      <div className="mb-9">
        <div
          id="traveler-label"
          className="mb-1 block font-display text-[1.2rem] font-semibold tracking-[-0.02em]"
        >
          Who's coming along?
        </div>
        <div className="mb-3.5 text-[0.9rem] text-muted2">Shapes the pace and the picks.</div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4" role="group" aria-labelledby="traveler-label">
          {SELECT_TRAVEL_LIST.map((item) => (
            <OptionCard
              key={item.id}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
              selected={formData.traveler === item.title}
              onClick={() => handleInputChange('traveler', item.title)}
            />
          ))}
        </div>
      </div>

      {/* Generate */}
      <div className="flex flex-wrap items-center gap-4.5 border-t border-line pt-8">
        <Button
          onClick={onGenerateTrip}
          disabled={isLoading || isSaving}
          className="inline-flex items-center gap-3 rounded-full bg-ink px-11 py-5 text-[1.15rem] font-semibold text-white transition hover:bg-black"
        >
          {isSaving ? 'Saving...' : isLoading ? 'Drafting...' : 'Draft my itinerary'}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Button>
        <span className="font-mono text-[0.84rem] text-muted2">~30 seconds · editable after</span>
      </div>

      <SignInDialog
        open={showSignIn}
        onOpenChange={setShowSignIn}
        onSignedIn={() => generateTrip()}
      />

      <GeneratingOverlay open={isLoading || isSaving} />
    </div>
  );
}

export default CreateTrip;
