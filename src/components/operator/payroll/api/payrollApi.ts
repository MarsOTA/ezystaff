
import { safeLocalStorage } from "@/utils/fileUtils";
import { Event, PayrollCalculation } from "../types";
import { getAttendanceRecords } from "./attendanceApi";
import { calculateEventPayroll, mapEventToPayrollEvent } from "./eventCalculations";
import { EVENTS_STORAGE_KEY, OPERATORS_STORAGE_KEY, ATTENDANCE_RECORDS_KEY } from "@/utils/operatorUtils";

export const fetchOperatorEvents = async (operatorId: number) => {
  try {
    // Get all events
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (!storedEvents) return { events: [], calculations: [] };
    
    const events = JSON.parse(storedEvents).map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }));
    
    // Get operators data
    const operatorsData = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (!operatorsData) return { events: [], calculations: [] };
    
    const operators = JSON.parse(operatorsData);
    const currentOperator = operators.find((op: any) => op.id === operatorId);
    
    if (!currentOperator || !currentOperator.assignedEvents || currentOperator.assignedEvents.length === 0) {
      return { events: [], calculations: [] };
    }
    
    // Filter events assigned to this operator
    const operatorEvents = events.filter((event: any) => 
      currentOperator.assignedEvents.includes(event.id)
    );
    
    // Map events to the correct format
    const mappedEvents: Event[] = operatorEvents.map(mapEventToPayrollEvent);
    
    // Get attendance records for calculations
    const attendanceData = getAttendanceRecords();
    const operatorAttendance = attendanceData.filter(record => 
      record.operatorId === currentOperator.email
    );
    
    // Process events to calculate payroll
    const calculations: PayrollCalculation[] = operatorEvents.map((event: any) => 
      calculateEventPayroll(event, operatorAttendance)
    );
    
    return {
      events: mappedEvents,
      calculations
    };
  } catch (error) {
    console.error("Error fetching operator events:", error);
    return { events: [], calculations: [] };
  }
};

export { getAttendanceRecords } from './attendanceApi';
