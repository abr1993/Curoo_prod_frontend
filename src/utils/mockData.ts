import { sampleConsults } from './sampleConsults';

export interface User {
  id: string;
  role: 'patient' | 'physician';
  email: string;
  phone?: string;
}

export interface PhysicianProfile {
  userId: string;
  displayName: string;
  avatar?: string;
  specialties?: string[];
  specialty: string;
  licensureStates: string[];
  priceCents: number;
  available: boolean;
  dailyCap: number;
  oooStart?: string;
  oooEnd?: string;
}

export interface Consult {
  id: string;
  patientId: string;
  physicianId: string;
  stateAtService: string;
  coverageAttested: boolean;
  redFlag: boolean;
  topic: string;
  questionBody: string;
  status: 'draft' | 'preauthorized' | 'pending' | 'accepted' | 'declined' | 'answered' | 'completed';
  submittedAt?: string;
  acceptedAt?: string;
  answeredAt?: string;
  declinedAt?: string;
  patientInitials: string;
  patientAge: number;
  pain?: number;
  blur?: number;
  lightSensitivity?: number;
  redness?: number;
  medications?: string;
  allergies?: string;
}

/* export interface ConsultDetail {
  id: string;
  patient_id: string;
  provider_specialty_id: string;
  topic?: string;
  state_at_service?: string;
  date_of_birth?: string;
  question_body?: string;
  status: string;
  submitted_date?: string;
  provider_id?: string;
  topics?: {
    topic: string;
  }[]
  medications?: string;
  allergies?: string;
  consult_specialty_symptom: {
    Value: number;
    specialty_symptom: {
      id: string;
      symptom: {
        id: string;
        name: string;
      };
    };
  }[]
} */
interface Topic{
  id: string;
  name: string;
  description: string;
}




export const mockPhysician: PhysicianProfile = {
  userId: 'phys-1',
  displayName: 'Dr. Sarah Chen',
  specialty: 'Ophthalmology, Eye & Eyelid Specialist',
  licensureStates: ['CA', 'NY', 'TX', 'FL'],
  priceCents: 7500,
  available: true,
  dailyCap: 15,
};
export const mockPhysicians: PhysicianProfile[] = [
  {
    userId: "0a524387-bc0b-49c1-9b3f-e993b3a4cc78",
    displayName: "Dr. Sarah Chen",
    specialty: "Ophthalmology, Eye & Eyelid Specialist",
    licensureStates: ["CA", "NY", "TX", "FL"],
    priceCents: 7500,
    available: true,
    dailyCap: 15,
  },
  {
    userId: "0a524387-bc0b-52c3-9b3f-e993b3a4cc78",
    displayName: "Dr. James Patel",
    specialty: "Cardiology, Heart & Vascular Specialist",
    licensureStates: ["WA", "OR", "NV"],
    priceCents: 6000,
    available: true,
    dailyCap: 12,
  },
  {
    userId: "0a524387-ab12-49c1-9b3f-e993b3a4cc78",
    displayName: "Dr. Maria Gomez",
    specialty: "Dermatology, Skin & Cosmetic Expert",
    licensureStates: ["NY", "FL"],
    priceCents: 5000,
    available: false,
    dailyCap: 10,
  },
];
export const mockConsults1 = [
  {
    id: "draft-1",
    topic: "Nutrition Advice for Seniors",
    stateAtService: "California",
    questionBody:
      "What are the best foods to help improve memory and focus for seniors?",
    status: "draft",
    submittedAt: "2025-10-20T09:15:00Z",
    patientId: "askjhdsjfjsdf",
    physicianId: "agfhsafgajksdalsd",
    coverageAttested: true,
    redFlag: false,
    patientInitials: "A. m.",
    patientAge: 23

  },
  {
    id: "pending-1",
    topic: "Managing Diabetes",
    stateAtService: "Texas",
    questionBody:
      "What lifestyle changes can help manage Type 2 diabetes effectively?",
    status: "pending",
    submittedAt: "2025-10-18T10:30:00Z",
    patientId: "askjhdsjfjsdf",
    physicianId: "agfhsafgajksdalsd",
    coverageAttested: true,
    redFlag: false,
    patientInitials: "A. m.",
    patientAge: 23
  },
  {
    id: "completed-1",
    topic: "Joint Pain Treatment",
    stateAtService: "New York",
    questionBody:
      "Which over-the-counter medicines are recommended for mild joint pain?",
    status: "completed",
    submittedAt: "2025-10-17T08:45:00Z",
    patientId: "askjhdsjfjsdf",
    physicianId: "agfhsafgajksdalsd",
    coverageAttested: true,
    redFlag: false,
    patientInitials: "A. m.",
    patientAge: 23
  },
  {
    id: "rejected-1",
    topic: "Sleep Improvement",
    stateAtService: "Florida",
    questionBody:
      "How can I naturally improve my sleep without taking medication?",
    status: "rejected",
    submittedAt: "2025-10-16T13:20:00Z",
    patientId: "askjhdsjfjsdf",
    physicianId: "agfhsafgajksdalsd",
    coverageAttested: true,
    redFlag: false,
    patientInitials: "A. m.",
    patientAge: 23
  },
];

export const mockConsults: Consult[] = sampleConsults;
