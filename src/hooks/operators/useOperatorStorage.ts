
import { useState, useEffect } from "react";
import { Operator } from "@/types/operator";
import { Event } from "@/pages/Events";
import { safeLocalStorage } from "@/utils/fileUtils";
import { getOperators, saveOperators, OPERATORS_STORAGE_KEY } from "@/utils/operatorUtils";

export const EVENTS_STORAGE_KEY = "app_events_data";

export const useOperatorStorage = () => {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      name: "Mario Rossi",
      email: "mario.rossi@example.com",
      phone: "+39 123 456 7890",
      status: "active",
      assignedEvents: [],
    },
    {
      id: 2,
      name: "Luigi Verdi",
      email: "luigi.verdi@example.com",
      phone: "+39 098 765 4321",
      status: "inactive",
      assignedEvents: [],
    },
  ]);

  const [events, setEvents] = useState<Event[]>([]);

  // Load operators and events from storage
  useEffect(() => {
    // Load operators from storage
    const storedOperators = getOperators();
    if (storedOperators.length > 0) {
      setOperators(storedOperators);
    } else {
      saveOperators(operators);
    }
    
    // Load events from storage
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }, []);
  
  // Save operators to storage whenever they change
  useEffect(() => {
    saveOperators(operators);
  }, [operators]);

  return {
    operators,
    setOperators,
    events
  };
};
