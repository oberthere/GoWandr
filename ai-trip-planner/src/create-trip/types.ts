import type { PlaceResult } from '@/types/trip';

export type { PlaceResult };

export interface TripFormData {
  location?: PlaceResult;
  noOfDays?: string;
  budget?: string;
  traveler?: string;
}

export interface BudgetOption {
  id: number;
  title: string;
  desc: string;
  icon: string;
  /** Prompt guidance for this tier, kept next to its title so they can't drift. */
  prompt: string;
}

export interface TravelerOption {
  id: number;
  title: string;
  desc: string;
  icon: string;
  people: string;
  /** Prompt guidance for this group. */
  prompt: string;
}
