
/**
 * Interfaces for event operator data retrieved from storage
 */
export interface EventOperatorData {
  event_id: number;
  hourly_rate: number;
  total_hours: number;
  net_hours: number;
  meal_allowance: number;
  travel_allowance: number;
  total_compensation: number;
  revenue_generated: number;
  events: {
    id: number;
    title: string;
    start_date: Date;
    end_date: Date;
    location: string;
    status: string;
    clients: {
      name: string;
    };
  };
}

/**
 * Interface for events retrieved from local storage
 */
export interface LocalStorageEvent {
  id: number;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  location?: string;
  status?: string;
  client?: string;
  hourlyRateCost?: number;
  hourlyRateSell?: number;
  grossHours?: number;
  netHours?: number;
}

/**
 * Interface for operator data retrieved from local storage
 */
export interface LocalStorageOperator {
  id: string | number;
  name: string;
  email?: string;
  assignedEvents?: number[];
}

/**
 * Interface for attendance records
 */
export interface AttendanceRecord {
  operatorId: string;
  timestamp: string;
  type: "check-in" | "check-out";
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  eventId: number;
}

/**
 * Result interface for fetching operator events
 */
export interface OperatorEventsResult {
  events: Event[];
  calculations: PayrollCalculation[];
}

// Re-export types from the main types.ts file to maintain compatibility
// Using 'export type' for proper TypeScript isolatedModules compatibility
import { Event, PayrollCalculation } from "../types";
export type { Event, PayrollCalculation };
