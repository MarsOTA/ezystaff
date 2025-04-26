
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import EventTable from "@/components/events/EventTable";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import EmptyEventCard from "@/components/events/EmptyEventCard";
import { useEvents } from "@/hooks/useEvents";
import { useEventOperations } from "@/hooks/useEventOperations";

const Events = () => {
  const navigate = useNavigate();
  const {
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
  } = useEvents();

  const { isClosingEvent, handleCloseEvent } = useEventOperations();

  const onEventClose = async (eventId: number) => {
    const updatedEvents = await handleCloseEvent(eventId, events);
    if (updatedEvents) {
      setEvents(updatedEvents);
      setIsDetailsOpen(false);
      setSelectedEvent(null);
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Eventi</CardTitle>
          <Button onClick={() => navigate(handleCreateEvent())}>
            <Plus className="mr-2 h-4 w-4" />
            Crea nuovo evento
          </Button>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <EventTable
              events={events}
              onShowDetails={handleShowDetails}
              onEditEvent={(e, id) => {
                e.stopPropagation();
                navigate(handleEditEvent(id));
              }}
              onDeleteEvent={(e, id) => {
                e.stopPropagation();
                handleDeleteEvent(id);
                toast.success("Evento eliminato con successo");
              }}
            />
          ) : (
            <EmptyEventCard onCreateEvent={() => navigate(handleCreateEvent())} />
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
