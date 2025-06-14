
// Helper function to calculate gross hours based on dates and times
export const calculateGrossHours = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string,
  endTime: string
): number => {
  if (!startDate || !endDate) return 0;
  
  try {
    // Parse start time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    // Parse end time
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    // Calculate difference in milliseconds and convert to hours
    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  } catch (error) {
    console.error("Error calculating gross hours:", error);
    return 0;
  }
};

// Helper function to calculate the number of days between two dates
const calculateEventDays = (startDate: Date, endDate: Date): number => {
  // Reset hours to compare only dates
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  // If same day, return 1
  if (start.getTime() === end.getTime()) {
    return 1;
  }
  
  // Calculate difference in days
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  return Math.max(1, diffDays);
};

// Helper function to calculate net hours from gross hours and break times
export const calculateNetHours = (
  grossHours: string,
  breakStartTime: string,
  breakEndTime: string,
  startDate?: Date,
  endDate?: Date
): string => {
  if (!grossHours || !breakStartTime || !breakEndTime) return "";
  
  try {
    const breakStart = breakStartTime.split(':').map(Number);
    const breakEnd = breakEndTime.split(':').map(Number);
    
    const breakStartMinutes = breakStart[0] * 60 + breakStart[1];
    const breakEndMinutes = breakEnd[0] * 60 + breakEnd[1];
    
    // Calculate break duration in hours for one day
    const breakDurationHours = (breakEndMinutes - breakStartMinutes) / 60;
    
    // Calculate number of event days
    let eventDays = 1;
    if (startDate && endDate) {
      eventDays = calculateEventDays(startDate, endDate);
    }
    
    // Total break time = break duration per day * number of days
    const totalBreakHours = breakDurationHours * eventDays;
    
    const netHoursValue = Math.max(0, Number(grossHours) - totalBreakHours);
    
    return netHoursValue.toFixed(2);
  } catch (error) {
    console.error("Error calculating net hours:", error);
    return "";
  }
};
