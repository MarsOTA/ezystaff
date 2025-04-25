
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
      // Update calculations with the new actual hours
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          // Calculate compensation based on hourly rate
          const hourlyRateEstimate = calc.compensation / (calc.netHours || 1);
          const newCompensation = actualHours * hourlyRateEstimate;
          
          return { 
            ...calc, 
            actual_hours: actualHours,
            compensation: newCompensation
          };
        }
        return calc;
      });
      
      setCalculations(updatedCalculations);
      
      // Calculate new summary
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
