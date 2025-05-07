
export interface Operator {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  assignedEvents?: number[];
  gender?: string;
  profession?: string;
}

export interface ExtendedOperator extends Operator {
  dateOfBirth?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  fiscalCode?: string;
  notes?: string;
  services?: string[];
  availability?: string[];
  fluentLanguages?: string[];
  basicLanguages?: string[];
  sizes?: string[];
  profileImage?: File | null;
  profileImageName?: string;
  idCardFront?: File | null;
  idCardFrontName?: string;
  idCardBack?: File | null;
  idCardBackName?: string;
  contractPdf?: File | null;
  contractPdfName?: string;
  bankDetails?: {
    accountHolder?: string;
    iban?: string;
    swift?: string;
  };
}
