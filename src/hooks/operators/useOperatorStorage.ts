
import { useState, useEffect } from "react";
import { Operator, OPERATORS_STORAGE_KEY } from "@/types/operator";
import { Event } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";

export const useOperatorStorage = () => {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      name: "Mario",
      surname: "Rossi",
      email: "mario.rossi@example.com",
      phone: "+39 123 456 7890",
      status: "active",
      assignedEvents: [],
    },
    {
      id: 2,
      name: "Giulia",
      surname: "Bianchi",
      email: "giulia.bianchi@example.com",
      phone: "+39 987 654 3210",
      status: "inactive",
      assignedEvents: [],
    },
  ]);

  const [events, setEvents] = useState<Event[]>([]);
  const [operatorsKey, setOperatorsKey] = useState<string>(Date.now().toString());

  useEffect(() => {
    const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      const parsedOperators = JSON.parse(storedOperators);
      setOperators(parsedOperators);
    }

    const storedEvents = safeLocalStorage.getItem("app_events_data");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const eventsWithDates = parsedEvents.map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }));
      setEvents(eventsWithDates);
    }
  }, []);

  useEffect(() => {
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
    // Update the key to trigger re-calculations when operators change
    setOperatorsKey(Date.now().toString());
  }, [operators]);

  return { operators, setOperators, events, operatorsKey };
};
