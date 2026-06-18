export interface ItineraryItem {
  order: number;
  type: string;
  name: string;
  placesQuery: string;
  suggestedTime: string;
  durationMinutes: number;
  estimatedCost: number;
  description: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  theme: string;
  dailyEstimatedCost: number;
  items: ItineraryItem[];
}

export interface HotelOption {
  hotelName: string;
  hotelAddress: string;
  pricePerNight: string;
  rating: number;
  description: string;
}

export interface Itinerary {
  destination: string;
  currency: string;
  estimatedTotalCost: number;
  tripSummary: string;
  hotelOptions: HotelOption[];
  days: ItineraryDay[];
}

export interface TripUserSelection {
  noOfDays?: string;
  budget?: string;
  traveler?: string;
  location?: { label: string };
}

export interface TripDoc {
  id: string;
  userEmail: string;
  userSelection: TripUserSelection;
  tripData: Itinerary;
}
