
import { useState, useEffect } from 'react';
import { Event, EVENTS_STORAGE_KEY } from '@/types/event';
import { safeLocalStorage } from "@/utils/fileUtils";

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isClosingEvent, setIsClosingEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load events from storage
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
      },
      {
        id: 2,
        title: "Fiera del Libro",
        client: "MediaGroup",
        startDate: new Date(2023, 7, 10, 9, 0),
        endDate: new Date(2023, 7, 12, 19, 0),
        personnelTypes: ["security", "hostess/steward"],
      },
    ]);
  };
  
  // Save events to storage
  useEffect(() => {
    if (events.length > 0) {
      safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  // Filter events by search query
  useEffect(() => {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents && searchQuery) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        
        const filteredEvents = eventsWithDates.filter(event => {
          const titleMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
          const clientMatch = event.client.toLowerCase().includes(searchQuery.toLowerCase());
          return titleMatch || clientMatch;
        });
        
        setEvents(filteredEvents);
      } catch (error) {
        console.error("Errore nel filtraggio degli eventi:", error);
      }
    } else if (storedEvents && !searchQuery) {
      // If search query is empty, load all events
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
      }
    }
  }, [searchQuery]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleDeleteEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  return {
    events,
    setEvents,
    selectedEvent,
    setSelectedEvent,
    isDetailsOpen,
    setIsDetailsOpen,
    isClosingEvent,
    setIsClosingEvent,
    searchQuery,
    setSearchQuery,
    handleEventClick,
    handleDeleteEvent
  };
};
