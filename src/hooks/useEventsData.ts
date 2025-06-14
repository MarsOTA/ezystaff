
import { useState, useEffect } from 'react';
import { Event, EVENTS_STORAGE_KEY } from '@/types/event';
import { safeLocalStorage } from "@/utils/fileUtils";

// Helper function to safely convert to Date
const safeToDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
};

export const useEventsData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isClosingEvent, setIsClosingEvent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load events from storage
  const loadEvents = () => {
    console.log("Loading events from storage...");
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: safeToDate(event.startDate),
          endDate: safeToDate(event.endDate)
        }));
        console.log("Events loaded:", eventsWithDates);
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        setDefaultEvents();
      }
    } else {
      setDefaultEvents();
    }
  };

  // Initial load
  useEffect(() => {
    loadEvents();
  }, []);

  // Listen for storage changes and window focus
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === EVENTS_STORAGE_KEY) {
        console.log("Storage changed, reloading events");
        loadEvents();
      }
    };

    const handleFocus = () => {
      console.log("Window focused, reloading events");
      loadEvents();
    };

    // Listen for custom events for immediate updates
    const handleOperatorAssignment = () => {
      console.log("Operator assignment detected, reloading events");
      loadEvents();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('operatorAssigned', handleOperatorAssignment);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
    };
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
  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true;
    const titleMatch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const clientMatch = event.client.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || clientMatch;
  });

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

  // Force refresh function
  const refreshEvents = () => {
    console.log("Force refreshing events...");
    loadEvents();
  };

  return {
    events: filteredEvents,
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
    handleDeleteEvent,
    refreshEvents
  };
};
