
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { useEventPlannerLogic } from "@/hooks/useEventPlannerLogic";
import EventPlannerHeader from "@/components/event/EventPlannerHeader";
import EventSelection from "@/components/event/EventSelection";
import AssignedEventsList from "@/components/event/AssignedEventsList";
import ShiftManager from "@/components/event/ShiftManager";
import EventPlannerNotes from "@/components/event/EventPlannerNotes";
import EventPlannerActions from "@/components/event/EventPlannerActions";

const EventPlanner = () => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  
  const {
    events,
    selectedOperator,
    selectedEventId,
    setSelectedEventId,
    selectedEvent,
    getAssignedEvents,
    notes,
    setNotes,
    shifts,
    shiftDate,
    setShiftDate,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    addShift,
    removeShift,
    isDateInEventRange,
    handleRemoveEvent,
    handleAssign
  } = useEventPlannerLogic(operatorId);

  if (!selectedOperator) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p>Operatore non trovato</p>
          <Button onClick={() => navigate("/operators")} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Lista Operatori
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <EventPlannerHeader />

        <EventSelection
          selectedOperator={selectedOperator}
          events={events}
          selectedEventId={selectedEventId}
          onEventChange={setSelectedEventId}
        />

        <AssignedEventsList 
          assignedEvents={getAssignedEvents()} 
          onRemoveEvent={handleRemoveEvent}
        />

        <ShiftManager
          selectedEvent={selectedEvent}
          shifts={shifts}
          shiftDate={shiftDate}
          setShiftDate={setShiftDate}
          shiftStartTime={shiftStartTime}
          setShiftStartTime={setShiftStartTime}
          shiftEndTime={shiftEndTime}
          setShiftEndTime={setShiftEndTime}
          addShift={addShift}
          removeShift={removeShift}
          isDateInEventRange={isDateInEventRange}
          assignedEvents={getAssignedEvents()}
        />

        <EventPlannerNotes
          notes={notes}
          setNotes={setNotes}
        />

        <EventPlannerActions
          selectedEventId={selectedEventId}
          onAssign={handleAssign}
        />
      </div>
    </Layout>
  );
};

export default EventPlanner;
