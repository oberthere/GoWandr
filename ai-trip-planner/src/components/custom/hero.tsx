import { useState } from 'react';
import { toast } from 'sonner';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const DESTINATIONS = [
  'Tokyo',
  'Paris',
  'Bali',
];

export function LandingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [destination, setDestination] = useState<object | null>(null);
  const [duration, setDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [customBudget, setCustomBudget] = useState('');

  const handleAction = (actionName: string) => {

    if (!isLoggedIn) {
      toast.error('Account required', {
        description: `Please log in to ${actionName}.`,
      });
    } else {
      toast.success(`Success! Added to your trip plan.`);
    }
  };

  return (
    <div className="w-full px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-900">Plan your trip</h1>
        <p className="mt-1 text-sm text-slate-600">Fill out the basics and generate an itinerary.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Destination</label>
            <GooglePlacesAutocomplete
              apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
              selectProps={{
                value: destination,
                onChange: (v: object | null) => setDestination(v),
                placeholder: 'Search destination...',
              }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Duration (days)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 7"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Budget</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
              >
                <option value="" disabled>Select budget</option>
                <option value="budget">Budget-friendly</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          {budget === 'custom' && (
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Custom budget</label>
              <input
                type="text"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                placeholder="e.g., $5000"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAction('generate an itinerary')}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!destination}
            >
              Generate Trip
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-3xl rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Quick destinations</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {DESTINATIONS.map((place) => (
            <button
              key={place}
              type="button"
              onClick={() => setDestination({ label: place, value: { description: place, place_id: place } })}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              {place}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}