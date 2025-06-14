
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

// Helper function to calculate net hours from gross hours and break times
export const calculateNetHours = (
  grossHours: string,
  breakStartTime: string,
  breakEndTime: string
): string => {
  if (!grossHours) return "";
  
  const breakStart = breakStartTime.split(':').map(Number);
  const breakEnd = breakEndTime.split(':').map(Number);
  
  const breakStartMinutes = breakStart[0] * 60 + breakStart[1];
  const breakEndMinutes = breakEnd[0] * 60 + breakEnd[1];
  
  const breakDurationHours = (breakEndMinutes - breakStartMinutes) / 60;
  
  const netHoursValue = Math.max(0, Number(grossHours) - breakDurationHours);
  
  return netHoursValue.toFixed(2);
};
