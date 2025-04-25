
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Event, PayrollCalculation, PayrollSummary } from "../types";
import { ExtendedOperator } from "@/types/operator";
import { fetchOperatorEvents } from "../api/payrollApi";
import { 
  calculateSummary, 
  processPayrollCalculations, 
  validateAttendance 
} from "../utils/payrollCalculations";

export const usePayrollData = (operator: ExtendedOperator) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calculations, setCalculations] = useState<PayrollCalculation[]>([]);
  const [summaryData, setSummaryData] = useState<PayrollSummary>({
    totalGrossHours: 0,
    totalNetHours: 0,
    totalCompensation: 0,
    totalAllowances: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Update actual hours for an event
  const updateActualHours = (eventId: number, actualHours: number) => {
    try {
      // Update calculations with the new actual hours
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          // Calculate compensation based on hourly rate (which needs to be determined from the event)
          // Since hourlyRate doesn't exist, use the compensation divided by the current netHours or 1 if netHours is 0
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

  // Update meal allowance
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

  // Update travel allowance
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

  // Load events and calculate payroll
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading events for operator ID:", operator.id);
      
      // Fetch events for this operator
      const { events: eventsData, calculations: calculationsData } = await fetchOperatorEvents(operator.id);
      
      if (!eventsData || eventsData.length === 0) {
        console.log("No events found for operator ID:", operator.id);
        setEvents([]);
        setCalculations([]);
        setSummaryData({
          totalGrossHours: 0,
          totalNetHours: 0,
          totalCompensation: 0,
          totalAllowances: 0,
          totalRevenue: 0
        });
        setLoading(false);
        return;
      }

      // Process events and calculations
      setEvents(eventsData);
      setCalculations(calculationsData);
      
      // Calculate summary
      const summary = calculateSummary(calculationsData);
      setSummaryData(summary);
      
    } catch (error) {
      console.error("Errore nel caricamento degli eventi:", error);
      toast.error("Errore nel caricamento degli eventi");
      
      setEvents([]);
      setCalculations([]);
      setSummaryData({
        totalGrossHours: 0,
        totalNetHours: 0,
        totalCompensation: 0,
        totalAllowances: 0,
        totalRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  }, [operator.id]);

  // Initial load
  useEffect(() => {
    loadEvents();
  }, [loadEvents, operator.id]);

  return {
    events,
    calculations,
    summaryData,
    loading,
    updateActualHours,
    updateMealAllowance,
    updateTravelAllowance,
    refresh: loadEvents
  };
};
