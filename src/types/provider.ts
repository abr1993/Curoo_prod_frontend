export interface Provider {
  avatar: string | null;
  user_id: string;
  display_name: string;
  price_cents: string;
  is_available: boolean;
  specialty: string;
  provider_experience_in_years: number;
  specialty_id: string;
  provider_specialty_id: string;
  state: string;
  specialties?: { specialty: { name: string } }[];
  licenses?: { price_cents: string, state: string }[];
}
export interface ProviderSpecialty {
  avatar: string | null;
  user_id: string;
  display_name: string;
  price_cents: string[];
  is_available: boolean;
  provider_experience_in_years: number;
  specialty: string;
  specialty_id: string;
  provider_specialty_id: string;  
  states?: string[];
}
export interface ProviderLicense{
  price_cents: string;
  state: string;
}
