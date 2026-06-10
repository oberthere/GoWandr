
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const SelectBudgetOptions = [
  { id: 1, title: 'Cheap', desc: 'Stay conscious of costs', icon: '💵' },
  { id: 2, title: 'Moderate', desc: 'Keep cost on the average side', icon: '💰' },
  { id: 3, title: 'Luxury', desc: 'Dont worry about cost', icon: '💸' },
];

const SelectTravelList = [
  { id: 1, title: 'Just Me', desc: 'A sole traveler in exploration', icon: '✈️', people: '1 Person' },
  { id: 2, title: 'A Couple', desc: 'Two travelers in tandem', icon: '🥂', people: '2 People' },
  { id: 3, title: 'Family', desc: 'A group of fun loving adventurers', icon: '🏡', people: '3 to 5 People' },
  { id: 4, title: 'Friends', desc: 'A bunch of thrill-seekers', icon: '⛵', people: '5 to 10 People' },
];

function CreateTrip() {
  const [destination, setDestination] = useState<object | null>(null);
  const [formData, setFormData] = useState<Record<string, string | object>>({});

  const handleInputChange = (name: string, value: string | object) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onGenerateTrip = () => {
    console.log(formData);
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

      <div className='mt-20 flex flex-col gap-10'>
        {/* Destination */}
        <div>
          <h2 className='text-xl my-3 font-medium'>What is destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            selectProps={{
              value: destination,
              onChange: (v: object | null) => {
                setDestination(v);
                handleInputChange('location', v as object);
              },
              placeholder: 'Search destination...',
            }}
          />
        </div>

        {/* Number of Days */}
        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input
            placeholder='Ex.3'
            type='number'
            onChange={(e) => handleInputChange('noOfDays', e.target.value)}
          />
        </div>

        {/* Budget */}
        <div>
          <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('budget', item.title)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow
                  ${formData.budget === item.title ? 'border-black shadow-lg' : 'border-gray-200'}`}
              >
                <div className='text-4xl'>{item.icon}</div>
                <h2 className='font-bold text-lg mt-2'>{item.title}</h2>
                <p className='text-sm text-gray-500'>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traveler */}
        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange('traveler', item.people)}
                className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow
                  ${formData.traveler === item.people ? 'border-black shadow-lg' : 'border-gray-200'}`}
              >
                <div className='text-4xl'>{item.icon}</div>
                <h2 className='font-bold text-lg mt-2'>{item.title}</h2>
                <p className='text-sm text-gray-500'>{item.desc}</p>
              </div>
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

export default CreateTrip