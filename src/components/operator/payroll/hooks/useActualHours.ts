
import { PayrollCalculation, PayrollSummary } from "../types";
import { calculateSummary } from "../utils/payrollCalculations";
import { toast } from "sonner";
import { safeLocalStorage } from "@/utils/fileUtils";
import { EVENTS_STORAGE_KEY } from "@/hooks/useOperators";

export const useActualHours = (
  calculations: PayrollCalculation[],
  setCalculations: React.Dispatch<React.SetStateAction<PayrollCalculation[]>>,
  setSummaryData: React.Dispatch<React.SetStateAction<PayrollSummary>>
) => {
  const updateActualHours = (eventId: number, actualHours: number) => {
    try {
      console.log(`Updating actual hours for event ${eventId} to ${actualHours}`);
      
      // Find the existing calculation to get the hourly rate
      const calculation = calculations.find(calc => calc.eventId === eventId);
      if (!calculation) {
        toast.error("Evento non trovato");
        return false;
      }
      
      // Calculate hourly rate based on existing compensation and net hours
      const hourlyRate = calculation.compensation / (calculation.netHours || 1);
      console.log(`Hourly rate: ${hourlyRate}`);
      
      // Update calculations with the new actual hours
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          // Calculate new compensation based on actual hours and the hourly rate
          const newCompensation = actualHours * hourlyRate;
          console.log(`New compensation: ${newCompensation}`);
          
          return { 
            ...calc, 
            actual_hours: actualHours,
            compensation: newCompensation
          };
        }
        return calc;
      });
      
      setCalculations(updatedCalculations);
      
      // Calculate new summary based on updated actual hours
      const newSummary = calculateSummary(updatedCalculations);
      setSummaryData(newSummary);
      
      // Update events data in localStorage to persist the actual hours
      const eventsData = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (eventsData) {
        const events = JSON.parse(eventsData);
        const updatedEvents = events.map((event: any) => {
          if (event.id === eventId) {
            return {
              ...event,
              actual_hours: actualHours
            };
          }
          return event;
        });
        
        console.log("Saving updated events with actual hours:", updatedEvents);
        safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      }
      
      toast.success("Ore effettive aggiornate con successo");
      return true;
    } catch (error) {
      console.error("Errore nell'aggiornamento delle ore effettive:", error);
      toast.error("Errore nell'aggiornamento delle ore effettive");
      return false;
    }
  };

  return { updateActualHours };
};
