
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from "@/components/Layout";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";
import EventDetailDialog from "@/components/events/EventDetailDialog";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isClosingEvent, setIsClosingEvent] = useState(false);
  const calendarRef = useRef<BigCalendar>(null);

  useEffect(() => {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => {
          // Ensure dates are properly converted to Date objects
          const startDate = event.startDate ? new Date(event.startDate) : new Date();
          const endDate = event.endDate ? new Date(event.endDate) : new Date();
          
          // Validate that dates are valid
          const validStartDate = isNaN(startDate.getTime()) ? new Date() : startDate;
          const validEndDate = isNaN(endDate.getTime()) ? new Date() : endDate;
          
          return {
            ...event,
            startDate: validStartDate,
            endDate: validEndDate,
            start: validStartDate,
            end: validEndDate,
          };
        });
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }, []);

  const handleSelectEvent = (event: Event) => {
    // Set the selected event and open the dialog
    const originalEvent = events.find((e) => e.id === event.id);
    if (originalEvent) {
      setSelectedEvent(originalEvent);
      setIsDetailsOpen(true);
    } else {
      navigate(`/events/create?id=${event.id}`);
    }
  };

  const handleCloseEvent = (eventId: number) => {
    // Implement event closing logic or navigate to edit
    setIsClosingEvent(true);
    setTimeout(() => {
      navigate(`/events/create?id=${eventId}`);
      setIsClosingEvent(false);
      setIsDetailsOpen(false);
    }, 500);
  };

  return (
    <Layout>
      <div style={{ height: '70vh' }}>
        <BigCalendar
          ref={calendarRef}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          onSelectEvent={handleSelectEvent}
          style={{ margin: '20px' }}
        />
      </div>
      <EventDetailDialog
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEventClose={handleCloseEvent}
        isClosingEvent={isClosingEvent}
      />
    </Layout>
  );
};

export default Calendar;
