import { useCallback, useRef, useState } from 'react';
import { loadPlacesLibrary } from '@/service/GoogleMaps';
import type { PlaceResult } from '@/types/trip';

interface Props {
  onChange: (value: PlaceResult | null) => void;
  placeholder?: string;
}

type Suggestion = google.maps.places.AutocompleteSuggestion;

interface CityItem {
  placeId: string;
  name: string;
  country: string;
}

/** `types` isn't on the typed PlacePrediction yet, so read it defensively. */
function isCountry(s: Suggestion): boolean {
  const types = (s.placePrediction as unknown as { types?: string[] })?.types;
  return types?.includes('country') ?? false;
}

export function PlacesAutocomplete({ onChange, placeholder }: Props) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [cityCountry, setCityCountry] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards against out-of-order async results from rapid typing.
  const reqRef = useRef(0);

  const fetchCities = useCallback(async (country: string, token: number) => {
    try {
      const { Place } = await loadPlacesLibrary();
      const { places } = await Place.searchByText({
        textQuery: `largest cities in ${country}`,
        fields: ['id', 'displayName', 'types'],
        maxResultCount: 15,
      });
      if (reqRef.current !== token) return;
      // Text search ignores includedType and mixes in attractions (e.g. "Taipei
      // 101"), so keep only results actually typed as a city/administrative area.
      const CITY_TYPES = ['locality', 'administrative_area_level_1', 'administrative_area_level_2'];
      const result = places
        .filter((p) => p.types?.some((t) => CITY_TYPES.includes(t)))
        .slice(0, 6)
        .map((p) => ({ placeId: p.id, name: p.displayName ?? '', country }));
      setCities(result);
      setCityCountry(country);
    } catch (err) {
      console.error('[PlacesAutocomplete cities]', err);
    }
  }, []);

  const search = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setSuggestions([]);
        setCities([]);
        return;
      }
      const token = ++reqRef.current;
      try {
        const { AutocompleteSuggestion } = await loadPlacesLibrary();
        const { suggestions: results } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: text,
          // Destinations only — cities, regions/states, and countries.
          includedPrimaryTypes: ['locality', 'administrative_area_level_1', 'country'],
        });
        if (reqRef.current !== token) return;
        setSuggestions(results);
        setCities([]);
        setIsOpen(true);

        // If a country matched, also surface its major cities so typing
        // "Taiwan" reveals Taipei, Kaohsiung, etc.
        const country = results.find(isCountry)?.placePrediction;
        if (country) fetchCities(country.mainText?.text ?? country.text.text, token);
      } catch (err) {
        console.error('[PlacesAutocomplete]', err);
        setSuggestions([]);
        setCities([]);
      }
    },
    [fetchCities],
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInput(text);
    if (text === '') onChange(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(text), 300);
  };

  const select = (label: string, placeId: string) => {
    setInput(label);
    onChange({ label, value: { placeId } });
    setSuggestions([]);
    setCities([]);
    setIsOpen(false);
  };

  const rowClass =
    'cursor-pointer px-4 py-2.5 text-[0.95rem] hover:bg-accent hover:text-accent-foreground';

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={handleInput}
        onFocus={() => (suggestions.length > 0 || cities.length > 0) && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder ?? 'Search destination...'}
        className="flex h-13 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-[1.05rem] shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
      />
      {isOpen && (suggestions.length > 0 || cities.length > 0) && (
        <ul className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          {suggestions.map((s, i) => (
            <li
              key={`s-${i}`}
              onMouseDown={() => select(s.placePrediction.text.text, s.placePrediction.placeId)}
              className={rowClass}
            >
              <span className="font-medium">{s.placePrediction.mainText?.text}</span>
              {s.placePrediction.secondaryText && (
                <span className="text-muted-foreground">
                  , {s.placePrediction.secondaryText.text}
                </span>
              )}
            </li>
          ))}

          {cities.length > 0 && (
            <>
              <li className="px-4 pt-2.5 pb-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground">
                Cities in {cityCountry}
              </li>
              {cities.map((c, i) => (
                <li
                  key={`c-${i}`}
                  onMouseDown={() => select(`${c.name}, ${c.country}`, c.placeId)}
                  className={rowClass}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-muted-foreground">, {c.country}</span>
                </li>
              ))}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
