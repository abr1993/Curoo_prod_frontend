export interface Condition{
  id: string;
  name: string;
  description: string;
}

export interface StateSetting {
  state: string;
  price: number;
  dailyCap: number;
  is_available?: boolean;
}

export interface SpecialtySetting {
  id: string;
  name?: string;
  available: boolean;
  experience_in_years: number;
  states: StateSetting[];
}

export interface Specialty {
  id: string;
  name: string;
}

export interface StateOption {
  value: string;
  label: string;
}