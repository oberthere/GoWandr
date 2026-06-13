import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import { MAX_TRIP_DAYS, SELECT_BUDGET_OPTIONS, SELECT_TRAVEL_LIST } from './constants';
import OptionCard from './OptionCard';
import type { PlaceResult, TripFormData } from './types';

function CreateTrip() {
  const [destination, setDestination] = useState<PlaceResult | null>(null);
  const [formData, setFormData] = useState<TripFormData>({});

  const handleInputChange = <K extends keyof TripFormData>(name: K, value: TripFormData[K]) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onGenerateTrip = () => {
    const { location, noOfDays, budget, traveler } = formData;
    if (!location || !noOfDays || !budget || !traveler) return;
    if (Number(noOfDays) > MAX_TRIP_DAYS) return;

    // TODO: call AI trip generation API
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
                selected={formData.traveler === item.people}
                onClick={() => handleInputChange('traveler', item.people)}
              />
            ))}
          </div>
        </div>

        <div className='my-10 flex justify-end'>
          <Button onClick={onGenerateTrip}>Generate Trip</Button>
        </div>
      </div>
    </div>
  );
}

export default CreateTrip;
