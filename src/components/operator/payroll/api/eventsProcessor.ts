
import { safeLocalStorage } from "@/utils/fileUtils";
import { 
  EventOperatorData, 
  LocalStorageEvent, 
  LocalStorageOperator,
  OperatorEventsResult 
} from "./types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";
import { calculateHours, calculateNetHours, updatePastEventStatuses } from "./calculationUtils";
import { getAttendanceRecords, integrateAttendanceData } from "./attendance";

/**
 * Convert local storage events to the format expected by processEvents
 * @param events - Events from local storage
 * @returns Event operator data in the expected format
 */
export const convertToEventOperatorsData = (events: LocalStorageEvent[]): EventOperatorData[] => {
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
 * Fetch events from local storage
 * @param operatorId - The ID of the operator
 * @returns Promise with events and payroll calculations
 */
export const fetchEventsFromLocalStorage = async (operatorId: string): Promise<OperatorEventsResult> => {
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
