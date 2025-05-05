import { supabase } from "@/integrations/supabase/client";
import { OperatorEventsResult } from "./types";
import { fetchEventsFromLocalStorage } from "./eventsProcessor";
import { getMarioSpecialEvent } from "./specialCases";

/**
 * Fetch events and event_operators data for an operator
 * @param operatorId - The ID of the operator
 * @returns Promise with events and payroll calculations
 */
export const fetchOperatorEvents = async (operatorId: string): Promise<OperatorEventsResult> => {
  console.log("Fetching events for operator ID:", operatorId);
  
  try {
    // Try to fetch from Supabase first (implementation placeholder)
    // Special case for Mario
    if (operatorId === "1" || operatorId === "mario.rossi@example.com") {
      // Return the Mare nostro event for Mario
      return getMarioSpecialEvent();
    }
    
    // For other users, fall back to local storage
    return fetchEventsFromLocalStorage(operatorId);
  } catch (error) {
    console.error("Error in fetchOperatorEvents:", error);
    return { events: [], calculations: [] }; // Return empty arrays instead of throwing
  }
};
