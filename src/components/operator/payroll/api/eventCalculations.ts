
import { format } from "date-fns";
import { Event, PayrollCalculation, CheckRecord } from "../types";

export const mapEventToPayrollEvent = (event: any): Event => {
  return {
    id: event.id,
    title: event.title,
    client: event.client,
    start_date: event.startDate,
    end_date: event.endDate,
    location: event.location || "",
    status: event.status || "upcoming",
    hourly_rate: event.hourlyRateCost || 15,
    hourly_rate_sell: event.hourlyRateSell || 25,
    estimated_hours: event.grossHours ? Number(event.grossHours) : calculateHoursFromDates(event.startDate, event.endDate),
    attendance: null
  };
};

export const calculateEventPayroll = (event: any, attendanceRecords: CheckRecord[]): PayrollCalculation => {
  // Get event start and end dates
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  
  // Calculate hours - prefer event values if they exist
  const grossHours = event.grossHours ? Number(event.grossHours) : calculateHoursFromDates(startDate, endDate);
  const netHours = event.netHours ? Number(event.netHours) : (grossHours > 5 ? grossHours - 1 : grossHours); // 1hr break if > 5hrs
  
  // Use event hourlyRateCost if available, default to 15
  const hourlyRate = event.hourlyRateCost ? Number(event.hourlyRateCost) : 15;
  const hourlyRateSell = event.hourlyRateSell ? Number(event.hourlyRateSell) : 25;
  
  // Calculate allowances
  const mealAllowance = grossHours > 5 ? 10 : 0;
  const travelAllowance = 15;
  
  // Calculate compensation and revenue
  const compensation = netHours * hourlyRate;
  const revenue = netHours * hourlyRateSell;
  
  // Get event attendance records
  const eventAttendance = attendanceRecords.filter(record => 
    record.eventId === event.id
  );
  
  // Determine attendance status based on check-in/out records
  let attendance = null;
  let actual_hours = null;
  
  if (eventAttendance.length > 0) {
    if (eventAttendance.some(r => r.type === "check-in")) {
      attendance = "present";
      
      // If there's check-in and check-out, calculate actual hours
      const checkIn = eventAttendance.find(r => r.type === "check-in");
      const checkOut = eventAttendance.find(r => r.type === "check-out");
      
      if (checkIn && checkOut) {
        const checkInTime = new Date(checkIn.timestamp);
        const checkOutTime = new Date(checkOut.timestamp);
        actual_hours = calculateHoursFromDates(checkInTime, checkOutTime);
      }
    }
  }
  
  // If the event has already set actual_hours, use that value
  if (event.actual_hours !== undefined && event.actual_hours !== null) {
    actual_hours = Number(event.actual_hours);
    console.log(`Using event's actual_hours: ${actual_hours}`);
  }
  // Set the actual_hours to the netHours by default if attendance is present but no check-in/out records
  else if (!actual_hours && attendance === "present") {
    actual_hours = netHours;
    console.log(`Setting actual_hours to netHours: ${netHours}`);
  }
  // For completed events, always set actual_hours to netHours if not already set
  else if (event.status === "completed" && actual_hours === null) {
    actual_hours = netHours;
    console.log(`Setting actual_hours to netHours for completed event: ${netHours}`);
  }
  // For any other event, default to netHours
  else if (actual_hours === null) {
    actual_hours = netHours;
    console.log(`Defaulting actual_hours to netHours: ${netHours}`);
  }
  
  return {
    eventId: event.id,
    eventTitle: event.title,
    client: event.client,
    date: format(startDate, "dd/MM/yyyy"),
    start_date: event.startDate,
    end_date: event.endDate,
    grossHours: grossHours,
    netHours: netHours,
    compensation: actual_hours !== null ? actual_hours * hourlyRate : compensation,
    mealAllowance: mealAllowance,
    travelAllowance: travelAllowance,
    totalRevenue: revenue,
    attendance: attendance,
    estimated_hours: grossHours,
    actual_hours: actual_hours
  };
};

// Helper function to calculate hours between two dates
const calculateHoursFromDates = (start: Date, end: Date): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
};
