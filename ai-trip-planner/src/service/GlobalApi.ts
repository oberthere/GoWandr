import axios from 'axios';

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface PlacePhotoRef {
  name: string;
  widthPx: number;
  heightPx: number;
}

/**
 * Picks the most presentable photo from a place's set. Google returns photos
 * roughly by recency, so the first is often a random user snapshot. We prefer
 * the highest-resolution landscape shot (best for wide heroes and cards),
 * falling back to the first photo when none are landscape.
 */
export function pickBestPhoto(photos?: PlacePhotoRef[]): string | undefined {
  if (!photos?.length) return undefined;
  const landscape = photos.filter((p) => p.widthPx >= p.heightPx * 1.2);
  const pool = landscape.length ? landscape : photos;
  return pool.reduce((best, p) => (p.widthPx > best.widthPx ? p : best)).name;
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
export function getPhotoUrl(photoName: string, maxWidthPx = 1200): string {
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`;
}
