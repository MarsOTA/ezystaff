
import { safeLocalStorage } from "@/utils/fileUtils";
import { Event, AttendanceRecord } from "./types";

/**
 * Get attendance records from local storage
 * @param operatorId - The ID or email of the operator
 * @returns Array of attendance records
 */
export const getAttendanceRecords = (operatorId: string): AttendanceRecord[] => {
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
export const integrateAttendanceData = (events: Event[], attendanceRecords: AttendanceRecord[]): Event[] => {
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
