import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { loadPlacesLibrary } from '@/service/GoogleMaps';
import type { PlaceResult } from '@/types/trip';

interface Props {
  onChange: (value: PlaceResult | null) => void;
  placeholder?: string;
  /** Input id so a visible <label> can associate via htmlFor. */
  id?: string;
}

type Suggestion = google.maps.places.AutocompleteSuggestion;

interface CityItem {
  placeId: string;
  name: string;
  country: string;
}

/** A single selectable row, flattened so keyboard navigation has one index space. */
interface Option {
  placeId: string;
  label: string;
  main: string;
  secondary: string;
  isCity: boolean;
}

/** `types` isn't on the typed PlacePrediction yet, so read it defensively. */
function isCountry(s: Suggestion): boolean {
  const types = (s.placePrediction as unknown as { types?: string[] })?.types;
  return types?.includes('country') ?? false;
}

const LISTBOX_ID = 'destination-listbox';

export function PlacesAutocomplete({ onChange, placeholder, id }: Props) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [cityCountry, setCityCountry] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Guards against out-of-order async results from rapid typing.
  const reqRef = useRef(0);

  // Flat list of selectable rows (predictions first, then a country's cities).
  const options = useMemo<Option[]>(
    () => [
      ...suggestions.map((s) => ({
        placeId: s.placePrediction.placeId,
        label: s.placePrediction.text.text,
        main: s.placePrediction.mainText?.text ?? s.placePrediction.text.text,
        secondary: s.placePrediction.secondaryText?.text ?? '',
        isCity: false,
      })),
      ...cities.map((c) => ({
        placeId: c.placeId,
        label: `${c.name}, ${c.country}`,
        main: c.name,
        secondary: c.country,
        isCity: true,
      })),
    ],
    [suggestions, cities],
  );
  const firstCityIndex = suggestions.length;

  const fetchCities = useCallback(async (country: string, token: number) => {
    try {
      const { Place } = await loadPlacesLibrary();
      const { places } = await Place.searchByText({
        textQuery: `largest cities in ${country}`,
        fields: ['id', 'displayName', 'types'],
        maxResultCount: 15,
      });
      if (reqRef.current !== token) return;
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
          // Destinations only: cities, regions/states, and countries.
          includedPrimaryTypes: ['locality', 'administrative_area_level_1', 'country'],
        });
        if (reqRef.current !== token) return;
        setSuggestions(results);
        setCities([]);
        setActive(-1);
        setIsOpen(true);

        // If a country matched, also surface its major cities.
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

  const select = (opt: Option) => {
    setInput(opt.label);
    onChange({ label: opt.label, value: { placeId: opt.placeId } });
    setSuggestions([]);
    setCities([]);
    setActive(-1);
    setIsOpen(false);
  };

  const moveActive = (delta: number) => {
    if (!isOpen && options.length > 0) {
      setIsOpen(true);
      return;
    }
    if (options.length === 0) return;
    setActive((prev) => {
      const next = prev + delta;
      if (next < 0) return 0;
      if (next > options.length - 1) return options.length - 1;
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Enter':
        if (isOpen && active >= 0 && options[active]) {
          e.preventDefault();
          select(options[active]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActive(-1);
        break;
    }
  };

  const rowClass =
    'cursor-pointer px-4 py-2.5 text-[0.95rem] hover:bg-accent hover:text-accent-foreground';

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen && options.length > 0}
        aria-controls={isOpen && options.length > 0 ? LISTBOX_ID : undefined}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `destination-option-${active}` : undefined}
        autoComplete="off"
        value={input}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => options.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder ?? 'Search destination...'}
        className="flex h-13 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-[1.05rem] shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
      />
      {/* Only render the listbox when it has options; an empty role="listbox"
          violates the "required owned elements" rule (it must contain options). */}
      {isOpen && options.length > 0 && (
        <ul
          id={LISTBOX_ID}
          role="listbox"
          aria-label="Destination suggestions"
          className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md"
        >
          {options.map((opt, i) => (
            <Fragment key={`${opt.placeId}-${i}`}>
              {opt.isCity && i === firstCityIndex && (
                <li
                  role="presentation"
                  className="px-4 pt-2.5 pb-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground"
                >
                  Cities in {cityCountry}
                </li>
              )}
              <li
                id={`destination-option-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseDown={() => select(opt)}
                onMouseEnter={() => setActive(i)}
                className={`${rowClass} ${i === active ? 'bg-accent text-accent-foreground' : ''}`}
              >
                <span className="font-medium">{opt.main}</span>
                {opt.secondary && <span className="text-muted-foreground">, {opt.secondary}</span>}
              </li>
            </Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
