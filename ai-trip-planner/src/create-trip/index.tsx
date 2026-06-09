import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

type PlaceValue = {
  label: string;
  value: {
    description: string;
    place_id: string;
  };
};

function CreateTrip() {
  const [destination, setDestination] = useState<PlaceValue | null>(null);

  return (
    <div className = 'sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
        <h2 className = 'front-bold text-3xl'>Tell us your travel preferences</h2>
        <p className = 'mt-3 textg-grey-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences. </p> 

      <div className = 'mt-20'>
        <div>
          <h2 className = 'text-xl my-3 font-medium'>What is your destination of choice </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            selectProps={{
              value: destination,
              onChange: (val: unknown) => setDestination(val as PlaceValue | null),
              placeholder: 'Enter destination (e.g., Paris)',
            }}
          />
        </div>
      </div>
    </div>
    
  )
}

export default CreateTrip