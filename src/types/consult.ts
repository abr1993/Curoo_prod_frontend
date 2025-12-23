export interface PreCheckData {
  state: string;
  dob: string;
  coverageAttested: boolean;
  redFlags: string[];
}

export interface QuestionDataNew {
  consultId?: string;
  providerSpecialtyId: string;
  question: string;
  legalName: string;
  showFullName: boolean;
  noMedications: boolean;
  pronouns: string;
  sexatbirth:string;  
  showNameOptions: string;
  topics: Topic[];
  historyFields: {
    historyFieldId: string;
    fieldName: string;
    value: string | string[];
  }[];
  symptoms: {
    specialtySymptomId: string;
    symptomName?: string;
    value: number;
  }[];
}

export interface Topic{
  id: string;
  name: string;
  description: string;
}

export interface Symptom {
  specialty_symptom_id: string;
  symptom_name: string;
}

export interface HistoryOption {
  option_id: string;
  option_value: string;
}

export interface HistoryField {
  history_field_id: string;
  field_name: string;
  field_type: "TEXT" | "MULTISELECT" | "TEXTAREA";
  options: HistoryOption[];
}

export interface ConsultDetail {
  id: string;
  patient_id: string;
  provider_id: string;
  provider_specialty_id: string;
  state_at_service: string;
  coverage_is_attested: boolean;
  has_red_flag: boolean;
  question_body: string;
  date_of_birth: string; // ISO string — you can parse it as Date if needed
  pronoun: "HE_HIM" | "SHE_HER" | "THEY_THEM" | string;
  sex_at_birth: "MALE" | "FEMALE" | string;
  legal_name: string;
  show_name_options: "ANONYMOUS" | "INITIALS_ONLY" | "FULL_NAME" | string;  
  status: string; // e.g., "ISDRAFT", "COMPLETED", etc.
  submitted_date: string | null;
  accepted_date: string | null;
  answered_date: string | null;
  declined_date: string | null;
  timed_out_date: string | null;
  created_by: string;
  created_date: string;
  updated_by: string | null;
  updated_date: string;
  deleted_date: string | null;
  topics: Topic[];

  // Relationships
  patient: {
    id: string;
    email: string;
  };

  provider: {
    id: string;
    email: string;
  };

  payment: any | null;

  consult_specialty_symptoms: ConsultSpecialtySymptom[];

  medical_history: MedicalHistory;
}

export interface ConsultSpecialtySymptom {
  Value: number;
  specialty_symptom: {
    id: string;
    symptom: {
      id: string;
      name: string;
    };
  };
}

export interface MedicalHistory {
  data: {
    [id: string]: {
      value: string | string[];
      fieldName: string;
    };
  };
}

export interface AnswerData {
  overview: string;
  differentials_general: string;
  self_care_general: string;
  when_to_seek_care: string;
}

export interface ReportBody{
    overview: string,
    differentials_general:string,
    self_care_general: string,
    when_to_seek_care: string
}

export interface ConsultInput {
  patientId: string;
  providerId: string;
  providerSpecialtyId: string;
  stateAtService?: string;
  topics?: string[];  
  questionBody?: string;  
  dateOfBirth: string; // ISO string for simplicity
  pronouns?: string;
  sexatbirth?: string;
  legalName?: string;
  showNameOptions: "ANONYMOUS" | "FULL_NAME" | "INITIALS_ONLY"; // adjust to match your enum  
  created_by?: string;
  historyFields: any;
  symptoms: any;
  status: "ISDRAFT" | "SUBMITTED" | "ACCEPTED" | "ANSWERED" | "DECLINED" | "AUTO_DECLINED";  
}