import { chatSession } from './AIModel';
import { buildPrompt } from '@/create-trip/constants';
import type { HotelOption, Itinerary, ItineraryDay } from '@/types/itinerary';

export interface TripPreferences {
  location: string;
  days: string;
  budget: string;
  travelers: string;
  startDate?: string;
}

/**
 * Parse and validate the model's JSON into a typed Itinerary.
 * Throws on anything unusable so views never get a half-built trip.
 */
export function parseItinerary(raw: string): Itinerary {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('The planner returned an unreadable response.');
  }
  if (!data || typeof data !== 'object') {
    throw new Error('The planner returned an unexpected response.');
  }

  const obj = data as Record<string, unknown>;
  const destination = typeof obj.destination === 'string' ? obj.destination : '';
  const days = Array.isArray(obj.days) ? (obj.days as ItineraryDay[]) : [];

  if (!destination || days.length === 0) {
    throw new Error('The planner could not build a full itinerary.');
  }

  return {
    destination,
    currency: typeof obj.currency === 'string' ? obj.currency : 'USD',
    estimatedTotalCost: typeof obj.estimatedTotalCost === 'number' ? obj.estimatedTotalCost : 0,
    tripSummary: typeof obj.tripSummary === 'string' ? obj.tripSummary : '',
    hotelOptions: Array.isArray(obj.hotelOptions) ? (obj.hotelOptions as HotelOption[]) : [],
    // Make sure every day has an items array.
    days: days.map((d) => ({ ...d, items: Array.isArray(d?.items) ? d.items : [] })),
  };
}

export async function generateItinerary(prefs: TripPreferences): Promise<Itinerary> {
  const result = await chatSession.sendMessage(buildPrompt(prefs));
  return parseItinerary(result.response.text());
}
