
import { useState } from "react";
import { PayrollCalculation, PayrollSummary } from "../types";
import { calculateSummary } from "../utils/payrollCalculations";
import { toast } from "sonner";

export const useAllowances = (
  calculations: PayrollCalculation[],
  setCalculations: React.Dispatch<React.SetStateAction<PayrollCalculation[]>>,
  setSummaryData: React.Dispatch<React.SetStateAction<PayrollSummary>>
) => {
  const updateMealAllowance = (eventId: number, value: number) => {
    try {
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          return {
            ...calc,
            mealAllowance: value
          };
        }
        return calc;
      });
      
      setCalculations(updatedCalculations);
      
      // Calculate new summary
      const newSummary = calculateSummary(updatedCalculations);
      setSummaryData(newSummary);
      
      toast.success("Rimborso pasto aggiornato");
      return true;
    } catch (error) {
      console.error("Errore nell'aggiornamento del rimborso pasto:", error);
      toast.error("Errore nell'aggiornamento del rimborso pasto");
      return false;
    }
  };

  const updateTravelAllowance = (eventId: number, value: number) => {
    try {
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          return {
            ...calc,
            travelAllowance: value
          };
        }
        return calc;
      });
      
      setCalculations(updatedCalculations);
      
      // Calculate new summary
      const newSummary = calculateSummary(updatedCalculations);
      setSummaryData(newSummary);
      
      toast.success("Rimborso viaggio aggiornato");
      return true;
    } catch (error) {
      console.error("Errore nell'aggiornamento del rimborso viaggio:", error);
      toast.error("Errore nell'aggiornamento del rimborso viaggio");
      return false;
    }
  };

  return {
    updateMealAllowance,
    updateTravelAllowance
  };
};
