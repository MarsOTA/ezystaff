
import { OperatorEventsResult } from "./types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";
import { getAttendanceRecords, integrateAttendanceData } from "./attendance";

/**
 * Generate the special Mare nostro event for Mario
 * @returns Object containing the Mare nostro event data
 */
export const getMarioSpecialEvent = (): OperatorEventsResult => {
  // Mare nostro event for Mario
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
  
  // Add attendance data for Mario
  const attendanceData = getAttendanceRecords("mario.rossi@example.com");
  const attendanceUpdatedData = integrateAttendanceData(eventsData, attendanceData);
  
  // Process payroll calculations
  const calculationsData = processPayrollCalculations(eventOperatorData);
  
  return {
    events: attendanceUpdatedData,
    calculations: calculationsData
  };
};
