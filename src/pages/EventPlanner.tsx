
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import { OPERATORS_STORAGE_KEY } from "@/types/operator";
import { toast } from "sonner";
import { safeLocalStorage } from "@/utils/fileUtils";
import { useEventPlannerData } from "@/hooks/useEventPlannerData";
import { useShiftManagement } from "@/hooks/useShiftManagement";
import EventSelection from "@/components/event/EventSelection";
import AssignedEventsList from "@/components/event/AssignedEventsList";
import ShiftManager from "@/components/event/ShiftManager";

const EventPlanner = () => {
  const { operatorId } = useParams<{ operatorId: string }>();
  const navigate = useNavigate();
  
  const {
    operators,
    setOperators,
    events,
    selectedOperator,
    selectedEventId,
    setSelectedEventId,
    selectedEvent,
    getAssignedEvents
  } = useEventPlannerData(operatorId);

  const {
    shifts,
    shiftDate,
    setShiftDate,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    addShift,
    removeShift,
    isDateInEventRange
  } = useShiftManagement(selectedEvent);

  const [notes, setNotes] = useState("");

  // Auto-populate shift times when event is selected
  useEffect(() => {
    if (selectedEvent) {
      setShiftDate(selectedEvent.startDate);
      const startTime = format(selectedEvent.startDate, "HH:mm");
      const endTime = format(selectedEvent.endDate, "HH:mm");
      setShiftStartTime(startTime);
      setShiftEndTime(endTime);
    } else {
      setShiftDate(undefined);
    }
  }, [selectedEvent, setShiftDate, setShiftStartTime, setShiftEndTime]);

  const handleAssign = () => {
    if (!selectedOperator || !selectedEventId) {
      toast.error("Seleziona un evento per continuare");
      return;
    }

    const eventId = parseInt(selectedEventId);
    
    // Update operators with new assignment
    const updatedOperators = operators.map(operator => {
      if (operator.id === selectedOperator.id) {
        const currentEvents = operator.assignedEvents || [];
        
        if (!currentEvents.includes(eventId)) {
          return {
            ...operator,
            assignedEvents: [...currentEvents, eventId]
          };
        } else {
          toast.info("Operatore già assegnato a questo evento");
          return operator;
        }
      }
      return operator;
    });

    // Save updated operators to localStorage
    setOperators(updatedOperators);
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updatedOperators));
    
    console.log("EventPlanner: Assignment completed, dispatching events");
    
    // Dispatch operator assignment event
    const assignmentEvent = new CustomEvent('operatorAssigned', {
      detail: { operatorId: selectedOperator.id, eventId }
    });
    window.dispatchEvent(assignmentEvent);
    
    toast.success(`${selectedOperator.name} ${selectedOperator.surname} assegnato con successo all'evento`);
    
    // Navigate back after assignment
    setTimeout(() => {
      navigate("/operators");
    }, 500);
  };

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
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/operators")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna alla Lista
          </Button>
          <h1 className="text-2xl font-bold">Event Planner</h1>
        </div>

        <EventSelection
          selectedOperator={selectedOperator}
          events={events}
          selectedEventId={selectedEventId}
          onEventChange={setSelectedEventId}
        />

        <AssignedEventsList assignedEvents={getAssignedEvents()} />

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
        />

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Scrivi eventuali note per questo operatore..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => navigate("/operators")}>
            Annulla
          </Button>
          <Button onClick={handleAssign} disabled={!selectedEventId}>
            Assegna Operatore
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default EventPlanner;
