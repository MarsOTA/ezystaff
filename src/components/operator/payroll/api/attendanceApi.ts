
import { safeLocalStorage } from "@/utils/fileUtils";
import { CheckRecord } from "../types";
import { ATTENDANCE_RECORDS_KEY } from "@/utils/operatorUtils";

export const getAttendanceRecords = (): CheckRecord[] => {
  const records = safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY);
  return records ? JSON.parse(records) : [];
};

// Add listener to localStorage changes for real-time updates
export const setupAttendanceListener = (callback: () => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === ATTENDANCE_RECORDS_KEY) {
      callback();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
