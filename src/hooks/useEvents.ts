import { useState, useEffect } from "react";
import { safeLocalStorage } from "@/utils/fileUtils";
import { Event } from "@/types/event";
import { EVENTS_STORAGE_KEY } from "@/utils/operatorUtils";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
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
        setDefaultEvents();
      }
    } else {
      setDefaultEvents();
    }
  }, []);

  const setDefaultEvents = () => {
    setEvents([
      {
        id: 1,
        title: "Concerto Rock in Roma",
        client: "Rock Productions",
        startDate: new Date(2023, 6, 15, 18, 0),
        endDate: new Date(2023, 6, 15, 23, 30),
        personnelTypes: ["security", "doorman", "hostess/steward"],
        staffCount: {
          "security": 5,
          "doorman": 3,
          "hostess/steward": 8
        }
      },
      {
        id: 2,
        title: "Fiera del Libro",
        client: "MediaGroup",
        startDate: new Date(2023, 7, 10, 9, 0),
        endDate: new Date(2023, 7, 12, 19, 0),
        personnelTypes: ["security", "hostess/steward"],
        staffCount: {
          "security": 4,
          "hostess/steward": 6
        }
      },
    ]);
  };

  useEffect(() => {
    if (events.length > 0) {
      safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const handleCreateEvent = () => {
    return "/events/create";
  };

  const handleEditEvent = (eventId: number) => {
    return `/events/create?id=${eventId}`;
  };

  const handleDeleteEvent = (eventId: number) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const handleShowDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  return {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    isDetailsOpen,
    setIsDetailsOpen,
    handleCreateEvent,
    handleEditEvent,
    handleDeleteEvent,
    handleShowDetails
  };
};
