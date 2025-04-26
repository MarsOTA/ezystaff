
import { differenceInMinutes } from "date-fns";
import { Event, PayrollCalculation, CheckRecord } from "../types";

export const calculateEventPayroll = (
  event: any,
  operatorAttendance: CheckRecord[]
): PayrollCalculation => {
  const eventRecords = operatorAttendance.filter(record => 
    record.eventId === event.id
  );
  
  // Set actual hours to net hours by default
  let actual_hours = event.netHours || undefined;
  
  if (eventRecords.length >= 2) {
    const recordsByDate: Record<string, CheckRecord[]> = {};
    
    eventRecords.forEach(record => {
      const recordDate = new Date(record.timestamp).toDateString();
      if (!recordsByDate[recordDate]) recordsByDate[recordDate] = [];
      recordsByDate[recordDate].push(record);
    });
    
    let totalMinutes = 0;
    
    Object.values(recordsByDate).forEach(dayRecords => {
      dayRecords.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      for (let i = 0; i < dayRecords.length - 1; i++) {
        if (dayRecords[i].type === "check-in" && dayRecords[i+1].type === "check-out") {
          const checkInTime = new Date(dayRecords[i].timestamp);
          const checkOutTime = new Date(dayRecords[i+1].timestamp);
          
          const minutesWorked = differenceInMinutes(checkOutTime, checkInTime);
          totalMinutes += minutesWorked;
          
          i++;
        }
      }
    });
    
    actual_hours = parseFloat((totalMinutes / 60).toFixed(2));
  }
  
  const netHours = parseFloat(event.netHours) || 0;
  const hourlyRate = parseFloat(event.hourlyRateCost) || 15;
  const hourlyRateSell = parseFloat(event.hourlyRateSell) || 25;
  
  const hoursToUse = actual_hours !== undefined ? actual_hours : netHours;
  const compensation = hoursToUse * hourlyRate;
  
  const mealAllowance = parseFloat(event.grossHours) >= 8 ? 10 : parseFloat(event.grossHours) >= 4 ? 5 : 0;
  const travelAllowance = 5;
  
  return {
    eventId: event.id,
    eventTitle: event.title,
    client: event.client || "Cliente non specificato",
    date: `${event.startDate.toLocaleDateString()} - ${event.endDate.toLocaleDateString()}`,
    start_date: event.startDate.toISOString(),
    end_date: event.endDate.toISOString(),
    grossHours: parseFloat(event.grossHours) || 0,
    netHours: netHours,
    actual_hours,
    compensation,
    mealAllowance,
    travelAllowance,
    totalRevenue: hoursToUse * hourlyRateSell
  };
};

export const mapEventToPayrollEvent = (event: any): Event => ({
  id: event.id,
  title: event.title,
  client: event.client,
  start_date: event.startDate.toISOString(),
  end_date: event.endDate.toISOString(),
  location: event.location || '',
  status: event.status || 'upcoming',
  hourly_rate: event.hourlyRateCost || 15,
  hourly_rate_sell: event.hourlyRateSell || 25,
  estimated_hours: event.netHours || 0,
  personnel_types: event.personnelTypes || []
});

