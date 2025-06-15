
import { useState, useEffect } from 'react';
import { Event, EVENTS_STORAGE_KEY } from '@/types/event';
import { Operator, OPERATORS_STORAGE_KEY } from '@/types/operator';
import { safeLocalStorage } from "@/utils/fileUtils";

const safeToDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
};

export const useDashboardData = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    setIsLoading(true);
    
    // Load events
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: safeToDate(event.startDate),
          endDate: safeToDate(event.endDate),
          shifts: event.shifts ? event.shifts.map((shift: any) => ({
            ...shift,
            date: safeToDate(shift.date)
          })) : []
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      }
    } else {
      setEvents([]);
    }

    // Load operators
    const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      try {
        const parsedOperators = JSON.parse(storedOperators);
        setOperators(parsedOperators);
      } catch (error) {
        console.error("Error loading operators:", error);
        setOperators([]);
      }
    } else {
      setOperators([]);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === EVENTS_STORAGE_KEY || e.key === OPERATORS_STORAGE_KEY) {
        loadData();
      }
    };

    const handleFocus = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('operatorAssigned', loadData);
    window.addEventListener('operatorDataUpdated', loadData);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('operatorAssigned', loadData);
      window.removeEventListener('operatorDataUpdated', loadData);
    };
  }, []);

  return {
    events,
    operators,
    isLoading,
    refreshData: loadData
  };
};
