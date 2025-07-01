
export interface PlacePrediction {
  description: string;
  place_id: string;
}

export type PersonnelType = "security" | "doorman" | "hostess" | "teamleader";

export const personnelTypes = [
  { id: "security", label: "Security" },
  { id: "doorman", label: "Doorman" },
  { id: "hostess", label: "Hostess/Steward" },
  { id: "teamleader", label: "Team Leader" },
];

export interface EventFormData {
  title: string;
  client: string;
  eventReferentName: string;
  eventReferentSurname: string;
  eventReferentPhone: string;
  selectedPersonnel: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  eventLocation: string;
  eventAddress: string;
  grossHours: string;
  breakStartTime: string;
  breakEndTime: string;
  netHours: string;
  hourlyRateCost: string;
  hourlyRateSell: string;
  personnelCounts?: Record<string, number>;
}

export const CLIENTS_STORAGE_KEY = "app_clients_data";
