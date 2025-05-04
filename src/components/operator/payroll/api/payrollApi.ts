
import { supabase } from "@/integrations/supabase/client";
import { Event, PayrollCalculation } from "../types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";

/**
 * Interface for event operator data retrieved from storage
 */
interface EventOperatorData {
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
interface LocalStorageEvent {
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
interface LocalStorageOperator {
  id: string | number;
  name: string;
  assignedEvents?: number[];
}

/**
 * Result interface for fetching operator events
 */
interface OperatorEventsResult {
  events: Event[];
  calculations: PayrollCalculation[];
}

/**
 * Fetch events and event_operators data for an operator
 * @param operatorId - The ID of the operator
 * @returns Promise with events and payroll calculations
 */
export const fetchOperatorEvents = async (operatorId: string): Promise<OperatorEventsResult> => {
  console.log("Fetching events for operator ID:", operatorId);
  
  try {
    // Try to fetch from Supabase first (implementation placeholder)
    // For now we're falling back to local storage as Supabase isn't fully implemented
    
    return fetchEventsFromLocalStorage(operatorId);
  } catch (error) {
    console.error("Error in fetchOperatorEvents:", error);
    return { events: [], calculations: [] }; // Return empty arrays instead of throwing
  }
};

/**
 * Helper function to calculate hours between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of hours
 */
const calculateHours = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
};

/**
 * Helper function to calculate net hours (gross hours minus break)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Net hours after break
 */
const calculateNetHours = (startDate: Date, endDate: Date): number => {
  const grossHours = calculateHours(startDate, endDate);
  return grossHours > 5 ? grossHours - 1 : grossHours; // 1 hour break if working > 5 hours
};

/**
 * Fetch events from local storage
 * @param operatorId - The ID of the operator
 * @returns Promise with events and payroll calculations
 */
const fetchEventsFromLocalStorage = async (operatorId: string): Promise<OperatorEventsResult> => {
  const storedEvents = localStorage.getItem("app_events_data");
  const storedOperators = localStorage.getItem("app_operators_data");
  
  if (!storedEvents || !storedOperators) {
    return { events: [], calculations: [] };
  }
  
  try {
    const operators = JSON.parse(storedOperators) as LocalStorageOperator[];
    const operator = operators.find((op) => op.id.toString() === operatorId.toString());
    
    if (!operator) {
      console.log("Operator not found in local storage");
      return { events: [], calculations: [] };
    }
    
    console.log("Found operator in local storage:", operator);
    
    const allEvents = JSON.parse(storedEvents) as LocalStorageEvent[];
    
    // Filter events assigned to this operator
    const operatorEvents = allEvents
      .filter((event) => operator.assignedEvents?.includes(event.id))
      .map((event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
    
    console.log("Assigned events from local storage:", operatorEvents);
    
    // Process events and calculations from local storage
    if (operatorEvents.length === 0) {
      return { events: [], calculations: [] };
    }
    
    // Convert local storage events to the format expected by processEvents
    const eventOperatorsData = convertToEventOperatorsData(operatorEvents);
    
    // Automatically update status for past events
    const updatedEventOperatorsData = updatePastEventStatuses(eventOperatorsData);
    
    // Process events data
    const eventsData = processEvents(updatedEventOperatorsData);
    
    // Process payroll calculations
    const calculationsData = processPayrollCalculations(updatedEventOperatorsData);
    
    console.log("Processed payroll data from local storage:", calculationsData);
    
    return {
      events: eventsData,
      calculations: calculationsData
    };
  } catch (error) {
    console.error("Error processing local storage data:", error);
    return { events: [], calculations: [] };
  }
};

/**
 * Convert local storage events to the format expected by processEvents
 * @param events - Events from local storage
 * @returns Event operator data in the expected format
 */
const convertToEventOperatorsData = (events: LocalStorageEvent[]): EventOperatorData[] => {
  return events.map((event) => {
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const netHours = event.netHours || calculateNetHours(startDate, endDate);
    const hourlyRate = event.hourlyRateCost || 15;
    
    return {
      event_id: event.id,
      hourly_rate: hourlyRate,
      total_hours: event.grossHours || calculateHours(startDate, endDate),
      net_hours: netHours,
      meal_allowance: calculateHours(startDate, endDate) > 5 ? 10 : 0,
      travel_allowance: 15,
      total_compensation: netHours * hourlyRate,
      revenue_generated: netHours * (event.hourlyRateSell || 25),
      events: {
        id: event.id,
        title: event.title,
        start_date: startDate,
        end_date: endDate,
        location: event.location || '',
        status: event.status || 'upcoming',
        clients: {
          name: event.client || ''
        }
      }
    };
  });
};

/**
 * Update status for past events
 * @param eventOperatorsData - Event operator data
 * @returns Updated event operator data
 */
const updatePastEventStatuses = (eventOperatorsData: EventOperatorData[]): EventOperatorData[] => {
  const now = new Date();
  
  return eventOperatorsData.map(item => {
    if (item.events) {
      const endDate = new Date(item.events.end_date);
      if (endDate < now && item.events.status !== "completed" && item.events.status !== "cancelled") {
        return {
          ...item,
          events: {
            ...item.events,
            status: "completed"
          }
        };
      }
    }
    return item;
  });
};
