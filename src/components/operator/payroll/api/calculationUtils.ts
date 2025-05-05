
/**
 * Helper function to calculate hours between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of hours
 */
export const calculateHours = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
};

/**
 * Helper function to calculate net hours (gross hours minus break)
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Net hours after break
 */
export const calculateNetHours = (startDate: Date, endDate: Date): number => {
  const grossHours = calculateHours(startDate, endDate);
  return grossHours > 5 ? grossHours - 1 : grossHours; // 1 hour break if working > 5 hours
};

/**
 * Update status for past events
 * @param eventOperatorsData - Event operator data
 * @returns Updated event operator data
 */
export const updatePastEventStatuses = (eventOperatorsData: any[]): any[] => {
  const now = new Date();
  
  return eventOperatorsData.map(item => {
    if (item.events) {
      const endDate = new Date(item.events.end_date);
      if (endDate < now && item.events.status !== "completed" && item.events.status !== "cancelled") {
        return {
          ...item,
          events: {
            ...item.events,
            status: "completed"
          }
        };
      }
    }
    return item;
  });
};
