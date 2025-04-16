
import { safeLocalStorage } from "@/utils/fileUtils";
import { Event, PayrollCalculation } from "../types";
import { differenceInMinutes } from "date-fns";

const ATTENDANCE_RECORDS_KEY = "attendance_records";
const EVENTS_STORAGE_KEY = "app_events_data";
const OPERATORS_STORAGE_KEY = "app_operators_data";

interface CheckRecord {
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

// Fetch events assigned to this operator
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
    
    // Get operators data to find which events are assigned to this operator
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
    
    // Get attendance records for this operator
    const attendanceData = getAttendanceRecords();
    const operatorAttendance = attendanceData.filter(record => 
      record.operatorId === currentOperator.email
    );
    
    // Process events to calculate payroll
    const calculations: PayrollCalculation[] = operatorEvents.map((event: any) => {
      // Find attendance records for this event
      const eventRecords = operatorAttendance.filter(record => 
        record.eventId === event.id
      );
      
      // Calculate actual hours worked based on check-in/check-out records
      let actual_hours = undefined;
      
      if (eventRecords.length >= 2) {
        // Group records by date
        const recordsByDate: Record<string, CheckRecord[]> = {};
        
        eventRecords.forEach(record => {
          const recordDate = new Date(record.timestamp).toDateString();
          if (!recordsByDate[recordDate]) recordsByDate[recordDate] = [];
          recordsByDate[recordDate].push(record);
        });
        
        // Calculate hours for each day
        let totalMinutes = 0;
        
        Object.values(recordsByDate).forEach(dayRecords => {
          // Sort records by timestamp
          dayRecords.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          
          // Find check-in and check-out pairs
          for (let i = 0; i < dayRecords.length - 1; i++) {
            if (dayRecords[i].type === "check-in" && dayRecords[i+1].type === "check-out") {
              const checkInTime = new Date(dayRecords[i].timestamp);
              const checkOutTime = new Date(dayRecords[i+1].timestamp);
              
              const minutesWorked = differenceInMinutes(checkOutTime, checkInTime);
              totalMinutes += minutesWorked;
              
              i++; // Skip the check-out record in the next iteration
            }
          }
        });
        
        actual_hours = parseFloat((totalMinutes / 60).toFixed(2));
      }
      
      // Use netHours from event for estimated hours (not grossHours)
      const grossHours = event.grossHours || 0; // Keep for reference
      const netHours = event.netHours || 0; // This is what we'll use for estimated hours
      const hourlyRate = event.hourlyRateCost || 0;
      const hourlyRateSell = event.hourlyRateSell || 0;
      
      const compensation = (actual_hours !== undefined ? actual_hours : netHours) * hourlyRate;
      
      // Add meal and travel allowances (demo values)
      const mealAllowance = grossHours >= 8 ? 10 : grossHours >= 4 ? 5 : 0;
      const travelAllowance = 5; // Default travel allowance
      
      return {
        eventId: event.id,
        eventTitle: event.title,
        client: event.client || "Cliente non specificato",
        date: `${event.startDate.toLocaleDateString()} - ${event.endDate.toLocaleDateString()}`,
        grossHours,
        netHours,
        actual_hours,
        hourlyRate,
        hourlyRateSell,
        compensation,
        mealAllowance,
        travelAllowance,
        totalRevenue: (actual_hours !== undefined ? actual_hours : netHours) * hourlyRateSell
      };
    });
    
    return {
      events: operatorEvents,
      calculations
    };
  } catch (error) {
    console.error("Error fetching operator events:", error);
    return { events: [], calculations: [] };
  }
};

// Get attendance records from localStorage
export const getAttendanceRecords = (): CheckRecord[] => {
  const records = safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY);
  return records ? JSON.parse(records) : [];
};
