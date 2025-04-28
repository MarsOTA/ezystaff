
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Event, PayrollCalculation, PayrollSummary } from "../types";
import { ExtendedOperator } from "@/types/operator";
import { fetchOperatorEvents } from "../api/payrollApi";
import { calculateSummary } from "../utils/payrollCalculations";
import { useAllowances } from "./useAllowances";
import { useActualHours } from "./useActualHours";

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

  const { updateMealAllowance, updateTravelAllowance } = useAllowances(
    calculations,
    setCalculations,
    setSummaryData
  );

  const { updateActualHours } = useActualHours(
    calculations,
    setCalculations,
    setSummaryData
  );

  // Get hourly rate from contract data or use default
  const getOperatorHourlyRate = useCallback(() => {
    if (operator.contractData?.grossSalary) {
      return parseFloat(operator.contractData.grossSalary) || 15;
    }
    return 15;
  }, [operator.contractData]);

  // Load events and calculate payroll
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading events for operator ID:", operator.id);
      
      // Get hourly rate from contract
      const operatorHourlyRate = getOperatorHourlyRate();
      console.log("Operator hourly rate:", operatorHourlyRate);
      
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

      // Add operator hourly rate to events data for calculations
      const eventsWithRate = eventsData.map(event => ({
        ...event,
        operatorHourlyRate,
        // Ensure estimated hours are set correctly
        estimated_hours: event.estimated_hours || 0
      }));
      
      // Process events and calculations with the contract rate
      const calculationsWithRate = calculationsData.map(calc => {
        // Use actual_hours if available, otherwise use netHours
        const hoursToUse = calc.actual_hours !== undefined ? calc.actual_hours : calc.netHours;
        
        // Recalculate compensation based on contract rate and hours
        return {
          ...calc,
          compensation: hoursToUse * operatorHourlyRate,
          // Ensure estimated hours are set correctly
          estimated_hours: calc.estimated_hours || calc.grossHours || 0
        };
      });
      
      setEvents(eventsWithRate);
      setCalculations(calculationsWithRate);
      
      // Calculate summary
      const summary = calculateSummary(calculationsWithRate);
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
  }, [operator.id, getOperatorHourlyRate]);

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
