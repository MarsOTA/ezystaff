
import { useState } from "react";
import { Event } from "@/types/event";
import { toast } from "sonner";

export interface Shift {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export const useShiftManagement = (selectedEvent: Event | null) => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [shiftDate, setShiftDate] = useState<Date | undefined>(undefined);
  const [shiftStartTime, setShiftStartTime] = useState("09:00");
  const [shiftEndTime, setShiftEndTime] = useState("18:00");

  const isDateInEventRange = (date: Date, event: Event) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    
    // Reset time for date comparison
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);
    
    return checkDate >= eventStart && checkDate <= eventEnd;
  };

  const addShift = () => {
    if (!shiftDate || !selectedEvent) return;
    
    // Validate that shift date is within event date range
    if (!isDateInEventRange(shiftDate, selectedEvent)) {
      toast.error("La data del turno deve essere compresa nel periodo dell'evento");
      return;
    }
    
    const newShift: Shift = {
      id: Date.now().toString(),
      date: shiftDate,
      startTime: shiftStartTime,
      endTime: shiftEndTime
    };
    
    setShifts([...shifts, newShift]);
    toast.success("Turno aggiunto con successo");
  };

  const removeShift = (shiftId: string) => {
    setShifts(shifts.filter(shift => shift.id !== shiftId));
    toast.success("Turno rimosso");
  };

  return {
    shifts,
    shiftDate,
    setShiftDate,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    addShift,
    removeShift,
    isDateInEventRange
  };
};
