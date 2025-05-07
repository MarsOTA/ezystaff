
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
  profileImage?: File | null;
  profileImageName?: string;
  idCardFront?: File | null;
  idCardFrontName?: string;
  idCardBack?: File | null;
  idCardBackName?: string;
  idCardFrontImage?: File | null;
  idCardFrontFileName?: string;
  idCardBackImage?: File | null;
  idCardBackFileName?: string;
  healthCardFrontImage?: File | null;
  healthCardFrontFileName?: string;
  healthCardBackImage?: File | null;
  healthCardBackFileName?: string;
  facePhotoFile?: File | null;
  facePhotoFileName?: string;
  bustPhotoFile?: File | null;
  bustPhotoFileName?: string;
  fullBodyPhotoFile?: File | null;
  fullBodyPhotoFileName?: string;
  resumeFile?: File | null;
  resumeFileName?: string;
  contractPdf?: File | null;
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
    startDate?: string;
    endDate?: string | null;
    grossSalary?: string;
    netSalary?: string;
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
  { value: "full-time", label: "Tempo Pieno" },
  { value: "part-time", label: "Part-Time" },
  { value: "a-chiamata", label: "A Chiamata" }
];
