import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EventTable from "@/components/events/EventTable";
import EmptyEventCard from "@/components/events/EmptyEventCard";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import EventSearch from "@/components/events/EventSearch";
import EventActions from "@/components/events/EventActions";
import { useEventsData } from "@/hooks/useEventsData";
import { handleCloseEvent } from "@/components/events/EventClosingUtils";
import { useOperatorData } from "@/hooks/useOperatorData";

const Events = () => {
  const navigate = useNavigate();
  const { aggressiveRefresh } = useOperatorData();
  const {
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
  } = useEventsData();

  // Listen for operator assignments to refresh events data
  useEffect(() => {
    const handleOperatorAssignment = () => {
      console.log("Events page: Operator assignment detected, refreshing events and operators");
      refreshEvents();
      aggressiveRefresh();
    };

    const handleOperatorDataUpdated = () => {
      console.log("Events page: Operator data updated, refreshing");
      refreshEvents();
      aggressiveRefresh();
    };

    window.addEventListener('operatorAssigned', handleOperatorAssignment);
    window.addEventListener('operatorDataUpdated', handleOperatorDataUpdated);

    return () => {
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
      window.removeEventListener('operatorDataUpdated', handleOperatorDataUpdated);
    };
  }, [refreshEvents, aggressiveRefresh]);

  const handleCreateEvent = () => {
    navigate("/events/create");
  };

  const handleEditEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    navigate(`/events/create?id=${eventId}`);
  };

  const onEventClose = (eventId: number) => {
    handleCloseEvent(
      eventId, 
      events, 
      setEvents, 
      setIsClosingEvent, 
      setIsDetailsOpen, 
      setSelectedEvent
    );
  };

  const formatDate = (date: Date) => {
    return format(date, "d MMMM yyyy", { locale: it });
  };

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Eventi</CardTitle>
          <div className="flex items-center gap-4">
            <EventActions onCreateEvent={handleCreateEvent} />
            <EventSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <EventTable
              events={events}
              onShowDetails={handleEventClick}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <EmptyEventCard onCreateEvent={handleCreateEvent} />
          )}
        </CardContent>
      </Card>
      
      <EventDetailDialog
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEventClose={onEventClose}
        isClosingEvent={isClosingEvent}
      />
    </Layout>
  );
};

export default Events;
