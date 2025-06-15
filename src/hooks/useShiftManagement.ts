
import { useState } from "react";
import { Event, Shift } from "@/types/event";
import { toast } from "sonner";

export const useShiftManagement = (selectedEvent: Event | null, initialShifts: Shift[] = []) => {
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
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
    
    const updatedShifts = [...shifts, newShift];
    setShifts(updatedShifts);
    toast.success("Turno aggiunto con successo");
    
    return updatedShifts;
  };

  const removeShift = (shiftId: string) => {
    const updatedShifts = shifts.filter(shift => shift.id !== shiftId);
    setShifts(updatedShifts);
    toast.success("Turno rimosso");
    
    return updatedShifts;
  };

  return {
    shifts,
    setShifts,
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
