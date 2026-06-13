export interface TripFormData {
  location?: PlaceResult;
  noOfDays?: string;
  budget?: string;
  traveler?: string;
}

export interface PlaceResult {
  label: string;
  value: object;
}

export interface BudgetOption {
  id: number;
  title: string;
  desc: string;
  icon: string;
}

export interface TravelerOption {
  id: number;
  title: string;
  desc: string;
  icon: string;
  people: string;
}
