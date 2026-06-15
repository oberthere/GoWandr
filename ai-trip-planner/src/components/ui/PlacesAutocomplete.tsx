import { useCallback, useRef, useState } from 'react';
import { loadPlacesLibrary } from '@/service/GoogleMaps';
import type { PlaceResult } from '@/types/trip';

interface Props {
  onChange: (value: PlaceResult | null) => void;
  placeholder?: string;
}

export function PlacesAutocomplete({ onChange, placeholder }: Props) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (text: string) => {
    if (!text.trim()) { setSuggestions([]); return; }
    try {
      const { AutocompleteSuggestion } = await loadPlacesLibrary();
      const { suggestions: results } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({ input: text });
      setSuggestions(results);
      setIsOpen(true);
    } catch (err) {
      console.error('[PlacesAutocomplete]', err);
      setSuggestions([]);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInput(text);
    if (text === '') onChange(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(text), 300);
  };

  const handleSelect = (s: google.maps.places.AutocompleteSuggestion) => {
    const pred = s.placePrediction;
    const label = pred.text.text;
    setInput(label);
    onChange({ label, value: { placeId: pred.placeId } });
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={handleInput}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder ?? 'Search destination...'}
        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover text-popover-foreground shadow-md">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => handleSelect(s)}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <span className="font-medium">{s.placePrediction.mainText?.text}</span>
              {s.placePrediction.secondaryText && (
                <span className="text-muted-foreground">, {s.placePrediction.secondaryText.text}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
