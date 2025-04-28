
import { PayrollCalculation, PayrollSummary } from "../types";
import { calculateSummary } from "../utils/payrollCalculations";
import { toast } from "sonner";

export const useActualHours = (
  calculations: PayrollCalculation[],
  setCalculations: React.Dispatch<React.SetStateAction<PayrollCalculation[]>>,
  setSummaryData: React.Dispatch<React.SetStateAction<PayrollSummary>>
) => {
  const updateActualHours = (eventId: number, actualHours: number) => {
    try {
      // Find the existing calculation to get the hourly rate
      const calculation = calculations.find(calc => calc.eventId === eventId);
      if (!calculation) {
        toast.error("Evento non trovato");
        return false;
      }
      
      // Calculate hourly rate based on existing compensation and net hours
      const hourlyRate = calculation.compensation / (calculation.netHours || 1);
      
      // Update calculations with the new actual hours
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          // Calculate new compensation based on actual hours and the hourly rate
          const newCompensation = actualHours * hourlyRate;
          
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
