
import { useState, useEffect } from "react";
import { Operator, OPERATORS_STORAGE_KEY } from "@/types/operator";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";

export const useEventPlannerData = (operatorId: string | undefined) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Load operators and events from localStorage
  useEffect(() => {
    const loadOperators = () => {
      const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (storedOperators) {
        try {
          const parsedOperators = JSON.parse(storedOperators);
          setOperators(parsedOperators);
          console.log("EventPlanner: Operators loaded:", parsedOperators);
        } catch (error) {
          console.error("Error loading operators:", error);
          setOperators([]);
        }
      }
    };

    const loadEvents = () => {
      const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          const eventsWithDates = parsedEvents.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            shifts: event.shifts ? event.shifts.map((shift: any) => ({
              ...shift,
              date: new Date(shift.date)
            })) : []
          }));
          setEvents(eventsWithDates);
          console.log("EventPlanner: Events loaded:", eventsWithDates);
        } catch (error) {
          console.error("Error loading events:", error);
          setEvents([]);
        }
      }
    };

    loadOperators();
    loadEvents();
  }, []);

  useEffect(() => {
    if (operatorId && operators.length > 0) {
      const operator = operators.find(op => op.id === parseInt(operatorId));
      setSelectedOperator(operator || null);
    }
  }, [operatorId, operators]);

  // Update selected event when event ID changes
  useEffect(() => {
    if (selectedEventId && events.length > 0) {
      const event = events.find(e => e.id === parseInt(selectedEventId));
      setSelectedEvent(event || null);
    } else {
      setSelectedEvent(null);
    }
  }, [selectedEventId, events]);

  const getAssignedEvents = () => {
    if (!selectedOperator || !selectedOperator.assignedEvents) return [];
    
    return events.filter(event => 
      selectedOperator.assignedEvents?.includes(event.id)
    );
  };

  return {
    operators,
    setOperators,
    events,
    setEvents,
    selectedOperator,
    selectedEventId,
    setSelectedEventId,
    selectedEvent,
    getAssignedEvents
  };
};
