
export interface Event {
  id: number;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date;
  personnelTypes: string[];
  location?: string;
  address?: string;
  grossHours?: number;
  breakStartTime?: string;
  breakEndTime?: string;
  netHours?: number;
  hourlyRateCost?: number;
  hourlyRateSell?: number;
  status?: string;
  requiredStaffCount?: Record<string, number>;
  staffCount?: Record<string, number>;
  assignedOperators?: any[];
}
