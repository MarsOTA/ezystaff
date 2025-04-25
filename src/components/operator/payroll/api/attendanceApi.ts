
import { safeLocalStorage } from "@/utils/fileUtils";
import { CheckRecord } from "../types";

const ATTENDANCE_RECORDS_KEY = "attendance_records";

export const getAttendanceRecords = (): CheckRecord[] => {
  const records = safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY);
  return records ? JSON.parse(records) : [];
};

