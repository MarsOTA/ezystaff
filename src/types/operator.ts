export interface Operator {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  assignedEvents?: number[];
  gender?: string;
  profession?: string;
  rating?: number;
  occupation?: string; // Add occupation as an alternative to profession
}

export interface ExtendedOperator extends Operator {
  birthDate?: string;
  birthCountry?: string;
  nationality?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  zipCode?: string;
  residenceCity?: string;
  fiscalCode?: string;
  vatNumber?: string;
  notes?: string;
  service?: string[];
  services?: string[];
  occupation?: string;
  availability?: string[];
  drivingLicense?: boolean;
  hasVehicle?: boolean;
  fluentLanguages?: string[];
  basicLanguages?: string[];
  sizes?: string[];
  height?: number;
  weight?: number;
  bodyType?: string;
  eyeColor?: string;
  hairColor?: string;
  hairLength?: string;
  shoeSize?: number;
  chestSize?: number;
  waistSize?: number;
  hipsSize?: number;
  visibleTattoos?: boolean;
  idCardNumber?: string;
  residencePermitNumber?: string;
  profileImage?: string | null;
  profileImageName?: string;
  idCardFront?: string | null;
  idCardFrontName?: string;
  idCardBack?: string | null;
  idCardBackName?: string;
  idCardFrontImage?: string | null;
  idCardFrontFileName?: string;
  idCardBackImage?: string | null;
  idCardBackFileName?: string;
  healthCardFrontImage?: string | null;
  healthCardFrontFileName?: string;
  healthCardBackImage?: string | null;
  healthCardBackFileName?: string;
  facePhotoFile?: string | null;
  facePhotoFileName?: string;
  bustPhotoFile?: string | null;
  bustPhotoFileName?: string;
  fullBodyPhotoFile?: string | null;
  fullBodyPhotoFileName?: string;
  resumeFile?: string | null;
  resumeFileName?: string;
  contractPdf?: string | null;
  contractPdfName?: string;
  accountHolder?: string;
  iban?: string;
  bic?: string;
  bankName?: string;
  swiftCode?: string;
  accountNumber?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  contractData?: {
    contractType?: string;
    ccnl?: string;
    level?: string;
    employmentType?: string;
    jobType?: string; // New field for "Tipo mansione"
    startDate?: string;
    endDate?: string | null;
    grossSalary?: string;
    netSalary?: string;
    weeklyHours?: string; // New field for "Ore settimanali"
    normalHoursPercentage?: string; // New field for "Percentuale dell'orario normale"
    workLocation?: string; // New field for "Sede di lavoro"
    workSite?: string; // New field for "Location di lavoro"
    basePayAndContingency?: string; // New field for "Paga base e contingenza"
    edr?: string; // New field for "EDR"
    totalMonthlyCompensation?: string; // New field for "Totale retribuzione mese"
    totalAnnualCompensation?: string; // New field for "Totale annuo (x 13)"
    contractSignDate?: string; // New field for "Data firma contratto"
    contractClause?: string; // New field for "Dicitura contratto"
    workingHoursClause?: string; // New field for "Dicitura orario di lavoro"
    rebalancing?: string; // New field for "Riproporzionamento"
    trainerName?: string; // New field for "Nominativo Formatore"
    trainingStartDate?: string; // New field for "Inizio formazione"
    trainingEndDate?: string; // New field for "Fine formazione"
  };
}

export const OPERATORS_STORAGE_KEY = "app_operators_data";

// Define service options for personnel
export const SERVICES = [
  { value: "security", label: "Security" },
  { value: "doorman", label: "Doorman" },
  { value: "hostess", label: "Hostess" },
  { value: "steward", label: "Steward" },
  { value: "bartender", label: "Bartender" },
  { value: "waiter", label: "Waiter/Waitress" },
  { value: "model", label: "Model" },
  { value: "promoter", label: "Promoter" },
  { value: "receptionist", label: "Receptionist" }
];

// Define availability options
export const AVAILABILITY = [
  { value: "weekday-day", label: "Giorni feriali - Diurno" },
  { value: "weekday-night", label: "Giorni feriali - Notturno" },
  { value: "weekend-day", label: "Weekend - Diurno" },
  { value: "weekend-night", label: "Weekend - Notturno" },
  { value: "holiday", label: "Festività" }
];

// Define language options
export const LANGUAGES = [
  "Italiano",
  "Inglese",
  "Francese",
  "Spagnolo",
  "Tedesco",
  "Russo",
  "Cinese",
  "Arabo",
  "Portoghese"
];

// Define size options
export const SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL"
];

// Define hair color options
export const HAIR_COLORS = [
  { value: "neri", label: "Neri" },
  { value: "castani", label: "Castani" },
  { value: "biondi", label: "Biondi" },
  { value: "rossi", label: "Rossi" },
  { value: "grigi", label: "Grigi/Bianchi" },
  { value: "colorati", label: "Colorati" }
];

// Define body type options
export const BODY_TYPES = [
  { value: "magra", label: "Magra" },
  { value: "normale", label: "Normale" },
  { value: "atletica", label: "Atletica" },
  { value: "muscolosa", label: "Muscolosa" },
  { value: "robusta", label: "Robusta" }
];

// Define contract types
export const CONTRACT_TYPES = [
  { value: "a-chiamata", label: "A Chiamata" },
  { value: "determinato", label: "Determinato" },
  { value: "indeterminato", label: "Indeterminato" },
  { value: "prestazione-occasionale", label: "Prestazione Occasionale" }
];

// Define job types
export const JOB_TYPES = [
  { value: "doorman", label: "Doorman" },
  { value: "security", label: "Security" },
  { value: "hostess-steward", label: "Hostess/Steward" },
  { value: "porterage", label: "Porterage" }
];
