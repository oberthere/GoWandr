import type { BudgetOption, TravelerOption } from './types';

export const SELECT_BUDGET_OPTIONS: BudgetOption[] = [
  { id: 1, title: 'Cheap',    desc: 'Stay conscious of costs',       icon: '💵' },
  { id: 2, title: 'Moderate', desc: 'Keep cost on the average side', icon: '💰' },
  { id: 3, title: 'Luxury',   desc: 'Don\'t worry about cost',       icon: '💸' },
];

export const SELECT_TRAVEL_LIST: TravelerOption[] = [
  { id: 1, title: 'Just Me',  desc: 'A sole traveler in exploration',      icon: '✈️',  people: '1 Person'     },
  { id: 2, title: 'A Couple', desc: 'Two travelers in tandem',             icon: '🥂',  people: '2 People'     },
  { id: 3, title: 'Family',   desc: 'A group of fun loving adventurers',   icon: '🏡',  people: '3 to 5 People' },
  { id: 4, title: 'Friends',  desc: 'A bunch of thrill-seekers',           icon: '⛵',  people: '5 to 10 People' },
];

export const MAX_TRIP_DAYS = 5;
