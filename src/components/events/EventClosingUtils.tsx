import { format } from "date-fns";
import { safeLocalStorage } from "@/utils/fileUtils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { OPERATORS_STORAGE_KEY } from "@/utils/operatorUtils";

export const calculateHours = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10;
};

export const calculateNetHours = (startDate: Date, endDate: Date): number => {
  const grossHours = calculateHours(startDate, endDate);
  return grossHours > 5 ? grossHours - 1 : grossHours;
};

export const handleCloseEvent = async (eventId: number, events: Event[], setEvents: React.Dispatch<React.SetStateAction<Event[]>>, setIsClosingEvent: React.Dispatch<React.SetStateAction<boolean>>, setIsDetailsOpen: React.Dispatch<React.SetStateAction<boolean>>, setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>) => {
  setIsClosingEvent(true);
  
  try {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        return { ...event, status: 'completed' };
      }
      return event;
    });
    
    safeLocalStorage.setItem("app_events_data", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    
    try {
      const { error: updateError } = await supabase
        .from('events')
        .update({ status: 'completed' })
        .eq('id', eventId);
        
      if (updateError) {
        console.error("Errore durante l'aggiornamento dell'evento nel database:", updateError);
      }
    } catch (dbError) {
      console.error("Errore nella comunicazione con il database:", dbError);
      // Continue with local storage only
    }
    
    const eventToClose = updatedEvents.find(e => e.id === eventId);
    
    if (eventToClose) {
      const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (storedOperators) {
        try {
          const operators = JSON.parse(storedOperators);
          let operatorsUpdated = false;
          
          for (const operator of operators) {
            if (operator.assignedEvents && operator.assignedEvents.includes(eventId)) {
              if (!operator.eventPayments) {
                operator.eventPayments = [];
              }
              
              operator.eventPayments.push({
                eventId,
                eventTitle: eventToClose.title,
                date: new Date().toISOString(),
                grossHours: eventToClose.grossHours || calculateHours(eventToClose.startDate, eventToClose.endDate),
                netHours: eventToClose.netHours || calculateNetHours(eventToClose.startDate, eventToClose.endDate),
                hourlyRate: eventToClose.hourlyRateCost || 15,
                mealAllowance: (eventToClose.grossHours || calculateHours(eventToClose.startDate, eventToClose.endDate)) > 5 ? 10 : 0,
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
          console.error("Errore nell'aggiornamento degli operatori:", error);
        }
      }
      
      try {
        const { data: eventOperators, error: eventOperatorsError } = await supabase
          .from('event_operators')
          .select('*')
          .eq('event_id', eventId);
          
        if (eventOperatorsError) {
          console.error("Errore durante il recupero degli operatori per l'evento:", eventOperatorsError);
        } else if (eventOperators && eventOperators.length > 0) {
          console.log("Operatori trovati per l'evento:", eventOperators);
          
          for (const operator of eventOperators) {
            const netHours = eventToClose.netHours || operator.net_hours || calculateNetHours(eventToClose.startDate, eventToClose.endDate);
            const hourlyRate = eventToClose.hourlyRateCost || operator.hourly_rate || 15;
            const totalCompensation = netHours * hourlyRate;
            
            try {
              const { error: updateOperatorError } = await supabase
                .from('event_operators')
                .update({
                  net_hours: netHours,
                  total_hours: eventToClose.grossHours || operator.total_hours || calculateHours(eventToClose.startDate, eventToClose.endDate),
                  hourly_rate: hourlyRate,
                  total_compensation: totalCompensation,
                  meal_allowance: operator.meal_allowance || ((netHours > 5) ? 10 : 0),
                  travel_allowance: operator.travel_allowance || 15,
                  revenue_generated: (eventToClose.hourlyRateSell || 25) * netHours
                })
                .eq('id', operator.id);
                
              if (updateOperatorError) {
                console.error(`Errore durante l'aggiornamento dell'operatore ${operator.id}:`, updateOperatorError);
              }
            } catch (error) {
              console.error(`Errore nella comunicazione con il database per l'operatore ${operator.id}:`, error);
            }
          }
        }
      } catch (error) {
        console.error("Errore durante l'accesso al database per gli operatori:", error);
      }
      
      toast.success("Evento chiuso e paghe aggiornate con successo!");
      
      setIsDetailsOpen(false);
      setSelectedEvent(null);
    }
  } catch (error) {
    console.error("Errore durante la chiusura dell'evento:", error);
    toast.error("Si è verificato un errore durante la chiusura dell'evento");
  } finally {
    setIsClosingEvent(false);
  }
};
