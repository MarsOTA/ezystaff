
// Helper function to calculate gross hours based on dates and times
export const calculateGrossHours = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string,
  endTime: string
): number => {
  if (!startDate || !endDate) return 0;
  
  try {
    // Parse start and end times
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // Calculate daily hours (end time - start time)
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = endHour * 60 + endMinute;
    
    // Handle case where end time is next day (e.g., 22:00 to 06:00)
    let dailyMinutes = endTimeMinutes - startTimeMinutes;
    if (dailyMinutes < 0) {
      dailyMinutes += 24 * 60; // Add 24 hours in minutes
    }
    
    const dailyHours = dailyMinutes / 60;
    
    // Calculate number of event days
    const eventDays = calculateEventDays(startDate, endDate);
    
    // Total gross hours = daily hours * number of days
    const totalGrossHours = dailyHours * eventDays;
    
    return Math.max(0, totalGrossHours);
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
