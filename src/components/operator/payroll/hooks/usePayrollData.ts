
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
          // Calculate compensation based on actual hours
          const hourlyRate = calc.compensation / (calc.netHours || 1);
          const newCompensation = actualHours * hourlyRate;
          const newRevenue = actualHours * (calc.totalRevenue / (calc.netHours || 1));
          
          return { 
            ...calc, 
            actual_hours: actualHours,
            compensation: newCompensation,
            totalRevenue: newRevenue
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

  // Function to reload payroll data
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Loading events for operator ID:", operator.id);
      
      // Fetch events for this operator
      const { events: eventsData, calculations: calculationsData } = await fetchOperatorEvents(operator.id.toString());
      
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
        return;
      }

      // Process completed events and calculate compensation based on gross salary
      const processedCalculations = calculationsData.map(calc => {
        // Retrieves contract data from operator
        const contractData = operator.contractData || {};
        // Get gross salary from contract or default to 0
        const grossSalary = parseFloat(contractData.grossSalary || "0");
        
        // Calculate hourly rate from gross monthly salary
        // Assuming standard 160 working hours per month (40 hours/week * 4 weeks)
        const hourlyRate = grossSalary / 160;
        
        if (calc.actual_hours === undefined) {
          // For completed events without actual hours set, use estimated hours minus break
          const grossHours = calc.grossHours;
          const netHours = grossHours > 5 ? grossHours - 1 : grossHours;
          
          // Calculate compensation based on gross salary hourly rate
          const compensation = netHours * hourlyRate;
          
          return {
            ...calc,
            netHours,
            compensation,
            actual_hours: netHours // Set actual_hours equal to netHours (estimated - break)
          };
        }
        
        // For events with actual_hours already set, recalculate compensation
        const compensation = calc.actual_hours * hourlyRate;
        
        return {
          ...calc,
          compensation
        };
      });
      
      // Set events and calculations
      setEvents(eventsData);
      setCalculations(processedCalculations);
      
      // Calculate summary
      const summary = calculateSummary(processedCalculations);
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
  }, [operator.id, operator.contractData]);

  // Load events and calculate payroll from Supabase or localStorage
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Expose function to refresh data
  const refreshData = useCallback(() => {
    loadEvents();
  }, [loadEvents]);

  return {
    events,
    calculations,
    summaryData,
    loading,
    updateActualHours,
    refreshData
  };
};
