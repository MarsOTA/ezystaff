
import { supabase } from "@/integrations/supabase/client";
import { Event, PayrollCalculation } from "../types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";
import { safeLocalStorage } from "@/utils/fileUtils";

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
  email?: string;
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
 * Interface for attendance records
 */
interface AttendanceRecord {
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
 * Fetch events and event_operators data for an operator
 * @param operatorId - The ID of the operator
 * @returns Promise with events and payroll calculations
 */
export const fetchOperatorEvents = async (operatorId: string): Promise<OperatorEventsResult> => {
  console.log("Fetching events for operator ID:", operatorId);
  
  try {
    // Try to fetch from Supabase first (implementation placeholder)
    // Special case for Mario
    if (operatorId === "1" || operatorId === "mario.rossi@example.com") {
      // Return the Mare nostro event for Mario
      const mareNostroEvent = {
        id: 2,
        title: "Mare nostro",
        client: "Napoli Eventi",
        start_date: "2025-05-05T09:00:00",
        end_date: "2025-05-05T18:00:00",
        location: "Via Napoli 45, Napoli, NA",
        status: "upcoming",
        hourly_rate: 20,
        hourly_rate_sell: 35,
        estimated_hours: 8,
      };
      
      const eventOperatorData = [{
        event_id: mareNostroEvent.id,
        hourly_rate: mareNostroEvent.hourly_rate,
        total_hours: 8,
        net_hours: 7,
        meal_allowance: 10,
        travel_allowance: 15,
        total_compensation: 7 * mareNostroEvent.hourly_rate,
        revenue_generated: 7 * mareNostroEvent.hourly_rate_sell,
        events: {
          id: mareNostroEvent.id,
          title: mareNostroEvent.title,
          start_date: new Date(mareNostroEvent.start_date),
          end_date: new Date(mareNostroEvent.end_date),
          location: mareNostroEvent.location,
          status: mareNostroEvent.status,
          clients: {
            name: mareNostroEvent.client
          }
        }
      }];
      
      // Process events data
      const eventsData = processEvents(eventOperatorData);
      
      // Add attendance data
      const attendanceData = getAttendanceRecords(operatorId);
      const attendanceUpdatedData = integrateAttendanceData(eventsData, attendanceData);
      
      // Process payroll calculations
      const calculationsData = processPayrollCalculations(eventOperatorData);
      
      return {
        events: attendanceUpdatedData,
        calculations: calculationsData
      };
    }
    
    // For other users, fall back to local storage
    return fetchEventsFromLocalStorage(operatorId);
  } catch (error) {
    console.error("Error in fetchOperatorEvents:", error);
    return { events: [], calculations: [] }; // Return empty arrays instead of throwing
  }
};

/**
 * Get attendance records from local storage
 * @param operatorId - The ID or email of the operator
 * @returns Array of attendance records
 */
const getAttendanceRecords = (operatorId: string): AttendanceRecord[] => {
  const records = safeLocalStorage.getItem("attendance_records");
  if (!records) return [];
  
  try {
    const parsedRecords = JSON.parse(records) as AttendanceRecord[];
    return parsedRecords.filter(record => record.operatorId === operatorId);
  } catch (error) {
    console.error("Error parsing attendance records:", error);
    return [];
  }
};

/**
 * Integrate attendance data with events
 * @param events - Array of events
 * @param attendanceRecords - Array of attendance records
 * @returns Updated events with attendance information
 */
const integrateAttendanceData = (events: Event[], attendanceRecords: AttendanceRecord[]): Event[] => {
  if (attendanceRecords.length === 0) return events;
  
  return events.map(event => {
    const eventRecords = attendanceRecords.filter(
      record => record.eventId === event.id
    );
    
    if (eventRecords.length === 0) return event;
    
    // Check if there's a check-in record
    const hasCheckIn = eventRecords.some(record => record.type === "check-in");
    // Check if there's a check-out record
    const hasCheckOut = eventRecords.some(record => record.type === "check-out");
    
    let attendance: "present" | "absent" | "late" | null = null;
    
    if (hasCheckIn && hasCheckOut) {
      attendance = "present";
    } else if (hasCheckIn) {
      attendance = "late"; // Only checked in but not out yet
    }
    
    return {
      ...event,
      attendance
    };
  });
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
    const operator = operators.find((op) => 
      op.id.toString() === operatorId.toString() || 
      op.email === operatorId
    );
    
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
    
    // Add attendance data
    const attendanceData = getAttendanceRecords(operatorId);
    const attendanceUpdatedData = integrateAttendanceData(eventsData, attendanceData);
    
    // Process payroll calculations
    const calculationsData = processPayrollCalculations(updatedEventOperatorsData);
    
    console.log("Processed payroll data from local storage:", calculationsData);
    
    return {
      events: attendanceUpdatedData,
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
