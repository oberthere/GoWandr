import type { PlaceResult } from './trip';

declare module 'react-google-places-autocomplete' {
  import type { ComponentType } from 'react';

  interface SelectProps {
    value: PlaceResult | null;
    onChange: (value: PlaceResult | null) => void;
    placeholder?: string;
  }

  interface GooglePlacesAutocompleteProps {
    apiKey: string;
    selectProps: SelectProps;
  }

  const GooglePlacesAutocomplete: ComponentType<GooglePlacesAutocompleteProps>;
  export default GooglePlacesAutocomplete;
}
