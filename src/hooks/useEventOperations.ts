
import { useState } from "react";
import { toast } from "sonner";
import { safeLocalStorage } from "@/utils/fileUtils";
import { supabase } from "@/integrations/supabase/client";
import { Event } from "@/types/event";

const EVENTS_STORAGE_KEY = "app_events_data";
const OPERATORS_STORAGE_KEY = "app_operators_data";

interface EventOperator {
  id: number;
  event_id: number;
  operator_id: string;
  net_hours: number | null;
  total_hours: number | null;
  hourly_rate: number | null;
  total_compensation: number | null;
  meal_allowance: number | null;
  travel_allowance: number | null;
  revenue_generated: number | null;
  operator: {
    contractData?: ContractData;
  } | null;
}

interface ContractData {
  grossSalary?: string;
  [key: string]: any;
}

export const useEventOperations = () => {
  const [isClosingEvent, setIsClosingEvent] = useState(false);

  const handleCloseEvent = async (eventId: number, events: Event[]) => {
    setIsClosingEvent(true);
    
    try {
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return { ...event, status: 'completed' };
        }
        return event;
      });
      
      safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      
      try {
        const { error: updateError } = await supabase
          .from('events')
          .update({ status: 'completed' })
          .eq('id', eventId);
          
        if (updateError) {
          console.error("Error updating event in database:", updateError);
        }
      } catch (dbError) {
        console.error("Error communicating with database:", dbError);
      }
      
      const eventToClose = updatedEvents.find(e => e.id === eventId);
      
      if (eventToClose) {
        await handleOperatorPayments(eventToClose);
        toast.success("Event closed and payments updated successfully!");
      }
      
      return updatedEvents;
    } catch (error) {
      console.error("Error during event closure:", error);
      toast.error("An error occurred while closing the event");
      return null;
    } finally {
      setIsClosingEvent(false);
    }
  };

  const handleOperatorPayments = async (eventToClose: Event) => {
    const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      try {
        const operators = JSON.parse(storedOperators);
        let operatorsUpdated = false;
        
        for (const operator of operators) {
          if (operator.assignedEvents && operator.assignedEvents.includes(eventToClose.id)) {
            if (!operator.eventPayments) {
              operator.eventPayments = [];
            }
            
            let hourlyRate = eventToClose.hourlyRateCost || 15;
            if (operator.contractData && operator.contractData.grossSalary) {
              hourlyRate = parseFloat(operator.contractData.grossSalary) || hourlyRate;
            }
            
            const grossHours = eventToClose.grossHours || calculateHours(eventToClose.startDate, eventToClose.endDate);
            const netHours = eventToClose.netHours || calculateNetHours(eventToClose.startDate, eventToClose.endDate);
            
            operator.eventPayments.push({
              eventId: eventToClose.id,
              eventTitle: eventToClose.title,
              date: new Date().toISOString(),
              grossHours: grossHours,
              netHours: netHours,
              hourlyRate: hourlyRate,
              mealAllowance: grossHours > 5 ? 10 : 0,
              travelAllowance: 15,
              status: 'paid'
            });
            
            operatorsUpdated = true;
          }
        }
        
        if (operatorsUpdated) {
          safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
        }
      } catch (error) {
        console.error("Error updating operators:", error);
      }
    }
    
    await updateOperatorsInDatabase(eventToClose);
  };

  const updateOperatorsInDatabase = async (eventToClose: Event) => {
    try {
      const { data: eventOperators, error: eventOperatorsError } = await supabase
        .from('event_operators')
        .select('*, operator:operator_id(*)')
        .eq('event_id', eventToClose.id);
        
      if (eventOperatorsError) {
        console.error("Error retrieving event operators:", eventOperatorsError);
      } else if (eventOperators && eventOperators.length > 0) {
        for (const operatorRecord of eventOperators as EventOperator[]) {
          let operatorContractData: ContractData | null = null;
          
          // Add null check for operator before accessing contractData
          if (operatorRecord.operator && 
              typeof operatorRecord.operator === 'object' &&
              operatorRecord.operator !== null &&
              'contractData' in operatorRecord.operator) {
            operatorContractData = operatorRecord.operator.contractData as ContractData;
          }
          
          const hourlyRate = operatorContractData?.grossSalary 
            ? parseFloat(operatorContractData.grossSalary) 
            : (eventToClose.hourlyRateCost || operatorRecord.hourly_rate || 15);
          
          const netHours = eventToClose.netHours || operatorRecord.net_hours || calculateNetHours(eventToClose.startDate, eventToClose.endDate);
          const grossHours = eventToClose.grossHours || operatorRecord.total_hours || calculateHours(eventToClose.startDate, eventToClose.endDate);
          const totalCompensation = netHours * hourlyRate;
          
          try {
            const { error: updateOperatorError } = await supabase
              .from('event_operators')
              .update({
                net_hours: netHours,
                total_hours: grossHours,
                hourly_rate: hourlyRate,
                total_compensation: totalCompensation,
                meal_allowance: operatorRecord.meal_allowance || ((grossHours > 5) ? 10 : 0),
                travel_allowance: operatorRecord.travel_allowance || 15,
                revenue_generated: (eventToClose.hourlyRateSell || 25) * netHours
              })
              .eq('id', operatorRecord.id);
              
            if (updateOperatorError) {
              console.error(`Error updating operator ${operatorRecord.id}:`, updateOperatorError);
            }
          } catch (error) {
            console.error(`Error communicating with database for operator ${operatorRecord.id}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Error accessing database for operators:", error);
    }
  };

  return {
    isClosingEvent,
    handleCloseEvent
  };
};

const calculateHours = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10;
};

const calculateNetHours = (startDate: Date, endDate: Date): number => {
  const grossHours = calculateHours(startDate, endDate);
  return grossHours > 5 ? grossHours - 1 : grossHours;
};
