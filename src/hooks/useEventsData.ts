
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
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to force refresh of events data
  const refreshEvents = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Load events from storage - triggered by refreshKey changes
  useEffect(() => {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: safeToDate(event.startDate),
          endDate: safeToDate(event.endDate)
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        setDefaultEvents();
      }
    } else {
      setDefaultEvents();
    }
  }, [refreshKey]);

  // Listen for focus events to refresh data when returning to the page
  useEffect(() => {
    const handleFocus = () => {
      console.log("Page focused, refreshing events data");
      refreshEvents();
    };

    window.addEventListener('focus', handleFocus);
    
    // Also refresh when the component mounts
    refreshEvents();
    
    return () => {
      window.removeEventListener('focus', handleFocus);
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
  useEffect(() => {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents && searchQuery) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: safeToDate(event.startDate),
          endDate: safeToDate(event.endDate)
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
      refreshEvents();
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
    handleDeleteEvent,
    refreshEvents
  };
};
