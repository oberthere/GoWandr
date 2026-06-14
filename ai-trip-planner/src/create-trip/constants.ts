import type { BudgetOption, TravelerOption } from './types';

export const SELECT_BUDGET_OPTIONS: BudgetOption[] = [
  { id: 1, title: 'Cheap',    desc: 'Stay conscious of costs',       icon: '💵' },
  { id: 2, title: 'Moderate', desc: 'Keep cost on the average side', icon: '💰' },
  { id: 3, title: 'Luxury',   desc: "Don't worry about cost",        icon: '💸' },
];

export const SELECT_TRAVEL_LIST: TravelerOption[] = [
  { id: 1, title: 'Just Me',  desc: 'A sole traveler in exploration',    icon: '✈️', people: '1 Person'      },
  { id: 2, title: 'A Couple', desc: 'Two travelers in tandem',           icon: '🥂', people: '2 People'      },
  { id: 3, title: 'Family',   desc: 'A group of fun loving adventurers', icon: '🏡', people: '3 to 5 People'  },
  { id: 4, title: 'Friends',  desc: 'A bunch of thrill-seekers',         icon: '⛵', people: '5 to 10 People' },
];

export const MAX_TRIP_DAYS = 5;

export const TRIP_PROMPT = `You are an expert travel planner. Generate a detailed, day-by-day trip itinerary based on the preferences below.

TRIP PREFERENCES
- Destination: {location}
- Trip length: {days} days
- Start date: {startDate}
- Budget level: {budget}
- Traveling as: {travelers}

BUDGET GUIDANCE
- "Cheap": prioritize free/low-cost attractions, street food, public transit, budget eats. Keep daily spend low.
- "Moderate": mix of paid attractions and free sights, mid-range sit-down restaurants, occasional taxi/rideshare.
- "Luxury": premium experiences, fine dining, private tours, no cost constraints. Recommend the best regardless of price.

TRAVELER GUIDANCE
- "Just Me": flexible solo-friendly spots, social/walkable areas, solo-dining-friendly restaurants.
- "A Couple": romantic/scenic spots, intimate restaurants, sunset views, couple-oriented activities.
- "Family": kid-friendly attractions, relaxed pacing, family restaurants, accessible venues.
- "Friends": group activities, nightlife, lively dining, fun/adventurous experiences.

PLANNING RULES
1. Plan 3-5 activities per day plus meal stops. Don't overpack.
2. GROUP ACTIVITIES BY GEOGRAPHIC PROXIMITY each day to minimize travel time — all stops in a day should be near each other and ordered as an efficient route (morning → night).
3. Each day should cover a different area/neighborhood of the destination so the trip doesn't backtrack.
4. Include breakfast, lunch, and dinner recommendations matched to the budget and traveler type.
5. Order each day's items chronologically as a logical walking/driving route.
6. Give realistic per-item cost estimates in local currency, and a daily total.

OUTPUT FORMAT
Return ONLY valid JSON — no markdown, no code fences, no commentary before or after. Use exactly this schema:

{
  "destination": "string",
  "currency": "ISO currency code, e.g. USD",
  "estimatedTotalCost": number,
  "tripSummary": "1-2 sentence overview",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "theme": "short neighborhood/area name or theme",
      "dailyEstimatedCost": number,
      "items": [
        {
          "order": 1,
          "type": "activity | breakfast | lunch | dinner | cafe | landmark",
          "name": "specific place name",
          "placesQuery": "exact searchable string for Google Places Text Search, e.g. 'Senso-ji Temple, Asakusa, Tokyo'",
          "suggestedTime": "e.g. 9:00 AM",
          "durationMinutes": number,
          "estimatedCost": number,
          "description": "1-2 sentences on what to do/why it fits their preferences"
        }
      ]
    }
  ]
}

IMPORTANT: Every "name" must be a REAL, specific, currently-operating place in {location} (not generic like "a local cafe"). The "placesQuery" must be specific enough to return exactly one result in Google Places — include the place name plus neighborhood and city.`;

export function buildPrompt(prefs: {
  location: string;
  days: string;
  budget: string;
  travelers: string;
  startDate?: string;
}): string {
  return TRIP_PROMPT
    .replaceAll('{location}',  prefs.location)
    .replaceAll('{days}',      prefs.days)
    .replaceAll('{startDate}', prefs.startDate ?? 'flexible')
    .replaceAll('{budget}',    prefs.budget)
    .replaceAll('{travelers}', prefs.travelers);
}
