import axios from 'axios';

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface PlacePhotoRef {
  name: string;
  widthPx: number;
  heightPx: number;
}

interface Place {
  id: string;
  displayName?: { text: string };
  photos?: PlacePhotoRef[];
}

interface SearchTextResponse {
  places?: Place[];
}

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': API_KEY,
    'X-Goog-FieldMask': ['places.photos', 'places.displayName', 'places.id'].join(','),
  },
};

/**
 * Text Search against the Places API (New). Returns up to a few matching
 * places with their photo references.
 */
export function getPlaceDetails(textQuery: string) {
  return axios.post<SearchTextResponse>(BASE_URL, { textQuery }, config);
}

/**
 * Builds a displayable image URL from a Places photo reference name
 * (e.g. "places/ABC/photos/XYZ").
 */
export function getPhotoUrl(photoName: string, maxWidthPx = 600): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`;
}
