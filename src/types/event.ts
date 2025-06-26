
export interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  operatorId?: number;
}

export interface DaySchedule {
  date: Date;
  startTime: string;
  endTime: string;
  dailyHours: number;
}

export interface Event {
  id: number;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date;
  personnelTypes: string[];
  location?: string;
  address?: string;
  status?: string;
  grossHours?: number;
  netHours?: number;
  breakStartTime?: string;
  breakEndTime?: string;
  hourlyRateCost?: number;
  hourlyRateSell?: number;
  personnelCounts?: Record<string, number>;
  shifts?: Shift[];
  daySchedules?: DaySchedule[];
  totalScheduledHours?: number;
}

export const EVENTS_STORAGE_KEY = "app_events_data";
