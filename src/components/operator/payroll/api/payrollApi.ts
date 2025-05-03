import { supabase } from "@/integrations/supabase/client";
import { Event, PayrollCalculation } from "../types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";

// Fetch events and event_operators data for an operator
export const fetchOperatorEvents = async (operatorId: string) => {
  console.log("Fetching events for operator ID:", operatorId);
  
  try {
    // First, let's check if the operator exists in the system
    // Note: Changed from "operators" to query local storage instead since the table doesn't exist in Supabase
    const storedOperators = localStorage.getItem("app_operators_data");
    if (!storedOperators) {
      console.log("No operators found in local storage");
      return { events: [], calculations: [] };
    }
    
    const operators = JSON.parse(storedOperators);
    const operator = operators.find((op: any) => op.id.toString() === operatorId);
    
    if (!operator) {
      console.log("Operator not found in local storage");
      return { events: [], calculations: [] };
    }
    
    console.log("Found operator in local storage:", operator);
    
    // Now let's find any events assigned to this operator through event_operators table
    const { data: eventOperatorsData, error: eventOperatorsError } = await supabase
      .from('event_operators')
      .select(`
        id,
        event_id,
        hourly_rate,
        total_hours,
        net_hours,
        meal_allowance,
        travel_allowance,
        total_compensation,
        revenue_generated,
        events(
          id,
          title,
          start_date,
          end_date,
          location,
          status,
          client
        )
      `)
      .eq('operator_id', operatorId);
    
    if (eventOperatorsError) {
      console.error("Error fetching operator events:", eventOperatorsError);
      return { events: [], calculations: [] };
    }
    
    console.log("Event operators data from database:", eventOperatorsData);
    
    // If no events found in Supabase, let's check local storage for assignments
    if (!eventOperatorsData || eventOperatorsData.length === 0) {
      console.log("No event_operators entries found, checking local storage for assignments");
      
      // Get events from localStorage as fallback
      const storedEvents = localStorage.getItem("app_events_data");
      
      if (!storedEvents) {
        return { events: [], calculations: [] };
      }
      
      try {
        if (!operator.assignedEvents || operator.assignedEvents.length === 0) {
          console.log("No assigned events found for operator in local storage");
          return { events: [], calculations: [] };
        }
        
        const allEvents = JSON.parse(storedEvents);
        // Filter events assigned to this operator
        const operatorEvents = allEvents.filter((event: any) => {
          return operator.assignedEvents.includes(event.id);
        }).map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        
        console.log("Assigned events from local storage:", operatorEvents);
        
        // Process events and calculations from local storage
        if (operatorEvents.length === 0) {
          return { events: [], calculations: [] };
        }
        
        // Convert local storage events to the format expected by processEvents
        const eventOperatorsData = operatorEvents.map((event: any) => ({
          event_id: event.id,
          hourly_rate: event.hourlyRateCost || 15,
          total_hours: event.grossHours || calculateHours(event.startDate, event.endDate),
          net_hours: event.netHours || calculateNetHours(event.startDate, event.endDate),
          meal_allowance: event.totalHours > 5 ? 10 : 0,
          travel_allowance: 15,
          total_compensation: (event.netHours || calculateNetHours(event.startDate, event.endDate)) * (event.hourlyRateCost || 15),
          revenue_generated: (event.netHours || calculateNetHours(event.startDate, event.endDate)) * (event.hourlyRateSell || 25),
          events: {
            id: event.id,
            title: event.title,
            start_date: event.startDate,
            end_date: event.endDate,
            location: event.location || '',
            status: event.status || 'upcoming',
            client: event.client || 'Unknown'
          }
        }));
        
        // Automatically update status for past events
        const now = new Date();
        const updatedEventOperatorsData = eventOperatorsData.map(item => {
          if (item.events) {
            const endDate = new Date(item.events.end_date);
            if (endDate < now && item.events.status !== "completed" && item.events.status !== "cancelled") {
              item.events.status = "completed";
            }
          }
          return item;
        });
        
        // Process events data
        const eventsData = processEvents(updatedEventOperatorsData);
        
        // Process payroll calculations
        const calculationsData = processPayrollCalculations(updatedEventOperatorsData);
        
        console.log("Processed payroll data from local storage:", calculationsData);
        
        return {
          events: eventsData,
          calculations: calculationsData
        };
      } catch (error) {
        console.error("Error processing local storage data:", error);
        return { events: [], calculations: [] };
      }
    }
    
    // Update status automatically for past events
    const now = new Date();
    const updatedEventOperatorsData = eventOperatorsData.map(item => {
      if (item.events) {
        const endDate = new Date(item.events.end_date);
        if (endDate < now && item.events.status !== "completed" && item.events.status !== "cancelled") {
          item.events.status = "completed";
        }
      }
      return item;
    });
    
    // Process events data with proper type casting for status and attendance
    const eventsData = processEvents(updatedEventOperatorsData);
    
    // Process payroll calculations
    const calculationsData = processPayrollCalculations(updatedEventOperatorsData);
    
    console.log("Processed payroll data from database:", calculationsData);
    
    return {
      events: eventsData,
      calculations: calculationsData
    };
  } catch (error) {
    console.error("Error in fetchOperatorEvents:", error);
    return { events: [], calculations: [] };
  }
};

// Helper function to calculate hours between two dates
const calculateHours = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
};

// Helper function to calculate net hours (gross hours minus break)
const calculateNetHours = (startDate: Date, endDate: Date): number => {
  const grossHours = calculateHours(startDate, endDate);
  return grossHours > 5 ? grossHours - 1 : grossHours; // 1 hour break if working > 5 hours
};
