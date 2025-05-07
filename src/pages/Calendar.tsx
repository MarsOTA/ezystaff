import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Layout from "@/components/Layout";
import { Event } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";
import { EVENTS_STORAGE_KEY } from "@/types/event";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const calendarRef = useRef<BigCalendar>(null);

  useEffect(() => {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
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

  const handleSelectEvent = (event: Event) => {
    navigate(`/events/create?id=${event.id}`);
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
    </Layout>
  );
};

export default Calendar;
