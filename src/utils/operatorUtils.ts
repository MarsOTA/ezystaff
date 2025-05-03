
import { Operator } from "@/types/operator";
import { Event } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";

// Storage keys
export const EVENTS_STORAGE_KEY = "app_events_data";
export const OPERATORS_STORAGE_KEY = "app_operators_data";
export const ATTENDANCE_RECORDS_KEY = "attendance_records";

// Default operators data for initial state
export const DEFAULT_OPERATORS: Operator[] = [
  {
    id: 1,
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    phone: "+39 123 456 7890",
    status: "active",
    assignedEvents: [1],
  },
  {
    id: 2,
    name: "Luigi Verdi",
    email: "luigi.verdi@example.com",
    phone: "+39 098 765 4321",
    status: "inactive",
    assignedEvents: [],
  },
  {
    id: 3,
    name: "Marco",
    email: "marco@operator.com",
    phone: "+39 333 444 5555",
    status: "active",
    assignedEvents: [1, 2],
  },
];

/**
 * Loads operators from local storage or returns defaults
 */
export const loadOperators = (): Operator[] => {
  const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
  if (storedOperators) {
    try {
      return JSON.parse(storedOperators);
    } catch (error) {
      console.error("Errore nel caricamento degli operatori:", error);
      return DEFAULT_OPERATORS;
    }
  } else {
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(DEFAULT_OPERATORS));
    return DEFAULT_OPERATORS;
  }
};

/**
 * Loads events from local storage
 */
export const loadEvents = (): Event[] => {
  const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
  if (storedEvents) {
    try {
      const parsedEvents = JSON.parse(storedEvents);
      return parsedEvents.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
    } catch (error) {
      console.error("Errore nel caricamento degli eventi:", error);
      return [];
    }
  } else {
    return [];
  }
};

/**
 * Saves operators to local storage
 */
export const saveOperators = (operators: Operator[]): void => {
  safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
};

/**
 * Saves events to local storage
 */
export const saveEvents = (events: Event[]): void => {
  safeLocalStorage.setItem(
    EVENTS_STORAGE_KEY, 
    JSON.stringify(
      events.map(event => ({
        ...event,
        startDate: event.startDate instanceof Date ? event.startDate.toISOString() : event.startDate,
        endDate: event.endDate instanceof Date ? event.endDate.toISOString() : event.endDate
      }))
    )
  );
};

/**
 * Generates a new operator ID
 */
export const generateNewOperatorId = (operators: Operator[]): number => {
  return Math.max(0, ...operators.map((op) => op.id)) + 1;
};

/**
 * Find operator by email (case insensitive)
 */
export const findOperatorByEmail = (operators: Operator[], email: string): Operator | null => {
  if (!email) return null;
  
  const normalizedEmail = email.toLowerCase();
  return operators.find(op => op.email && op.email.toLowerCase() === normalizedEmail) || null;
};
