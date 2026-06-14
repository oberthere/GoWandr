import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatSession } from '@/service/AIModel';
import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { toast } from 'sonner';

import { MAX_TRIP_DAYS, SELECT_BUDGET_OPTIONS, SELECT_TRAVEL_LIST, buildPrompt } from './constants';
import OptionCard from './OptionCard';
import type { PlaceResult, TripFormData } from './types';

function CreateTrip() {
  const [destination, setDestination] = useState<PlaceResult | null>(null);
  const [formData, setFormData] = useState<TripFormData>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = <K extends keyof TripFormData>(name: K, value: TripFormData[K]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onGenerateTrip = async () => {
    const { location, noOfDays, budget, traveler } = formData;

    if (!location || !noOfDays || !budget || !traveler) {
      toast.error('Please fill in all fields before generating.');
      return;
    }
    if (Number(noOfDays) > MAX_TRIP_DAYS) {
      toast.error(`Maximum trip length is ${MAX_TRIP_DAYS} days.`);
      return;
    }

    const prompt = buildPrompt({
      location: location.label,
      days: noOfDays,
      budget,
      travelers: traveler,
    });

    setIsLoading(true);
    try {
      const result = await chatSession.sendMessage(prompt);
      const raw = result.response.text();
      const itinerary = JSON.parse(raw);
      console.log(itinerary);
      toast.success('Your trip is ready!');
      // TODO: navigate to itinerary results page, passing itinerary
    } catch {
      toast.error('Failed to generate trip. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className='mt-20 flex flex-col gap-10'>
        {/* Destination */}
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            selectProps={{
              value: destination,
              onChange: (v: PlaceResult | null) => {
                setDestination(v);
                if (v) handleInputChange('location', v);
              },
              placeholder: 'Search destination...',
            }}
          />
        </div>

        {/* Number of Days */}
        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input
            placeholder='Ex. 3'
            type='number'
            min={1}
            max={MAX_TRIP_DAYS}
            value={formData.noOfDays ?? ''}
            onChange={(e) => {
              const val = Math.max(1, Number(e.target.value));
              handleInputChange('noOfDays', String(val));
            }}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
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
        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
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

        <div className='my-10 flex justify-end'>
          <Button onClick={onGenerateTrip} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Trip'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
