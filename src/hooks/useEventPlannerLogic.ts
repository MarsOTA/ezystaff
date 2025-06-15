
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "sonner";
import { OPERATORS_STORAGE_KEY } from "@/types/operator";
import { EVENTS_STORAGE_KEY } from "@/types/event";
import { safeLocalStorage } from "@/utils/fileUtils";
import { useEventPlannerData } from "@/hooks/useEventPlannerData";
import { useShiftManagement } from "@/hooks/useShiftManagement";
import { supabase } from "@/integrations/supabase/client";

export const useEventPlannerLogic = (operatorId: string | undefined) => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");

  const {
    operators,
    setOperators,
    events,
    setEvents,
    selectedOperator,
    selectedEventId,
    setSelectedEventId,
    selectedEvent,
    getAssignedEvents
  } = useEventPlannerData(operatorId);

  // Get existing shifts for selected event
  const existingShifts = selectedEvent?.shifts?.filter(shift => shift.operatorId === selectedOperator?.id) || [];

  const {
    shifts,
    setShifts,
    shiftDate,
    setShiftDate,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    addShift,
    removeShift,
    isDateInEventRange
  } = useShiftManagement(selectedEvent, existingShifts);

  // Auto-populate shift times when event is selected
  useEffect(() => {
    if (selectedEvent) {
      setShiftDate(selectedEvent.startDate);
      const startTime = format(selectedEvent.startDate, "HH:mm");
      const endTime = format(selectedEvent.endDate, "HH:mm");
      setShiftStartTime(startTime);
      setShiftEndTime(endTime);
      
      // Load existing shifts for this operator and event
      const operatorShifts = selectedEvent.shifts?.filter(shift => shift.operatorId === selectedOperator?.id) || [];
      setShifts(operatorShifts);
    } else {
      setShiftDate(undefined);
      setShifts([]);
    }
  }, [selectedEvent, selectedOperator, setShiftDate, setShiftStartTime, setShiftEndTime, setShifts]);

  const sendEmailNotification = async (operatorEmail: string, operatorName: string, eventTitle: string, eventDate: string, type: 'removal' | 'assignment') => {
    try {
      const { data, error } = await supabase.functions.invoke('send-operator-notification', {
        body: {
          operatorEmail,
          operatorName,
          eventTitle,
          eventDate,
          type
        }
      });

      if (error) {
        console.error('Error sending email notification:', error);
        toast.error("Errore nell'invio della notifica email");
      } else {
        console.log('Email notification sent successfully:', data);
        toast.success("Notifica email inviata con successo");
      }
    } catch (error) {
      console.error('Error sending email notification:', error);
      toast.error("Errore nell'invio della notifica email");
    }
  };

  const updateEventShifts = (eventId: number, operatorId: number, newShifts: any[], remove: boolean = false) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        let updatedShifts = event.shifts || [];
        
        if (remove) {
          // Remove all shifts for this operator
          updatedShifts = updatedShifts.filter(shift => shift.operatorId !== operatorId);
        } else {
          // Remove existing shifts for this operator and add new ones
          updatedShifts = updatedShifts.filter(shift => shift.operatorId !== operatorId);
          const shiftsWithOperator = newShifts.map(shift => ({
            ...shift,
            operatorId
          }));
          updatedShifts = [...updatedShifts, ...shiftsWithOperator];
        }
        
        return {
          ...event,
          shifts: updatedShifts
        };
      }
      return event;
    });

    setEvents(updatedEvents);
    safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const handleRemoveEvent = async (eventId: number) => {
    if (!selectedOperator) return;

    const eventToRemove = events.find(e => e.id === eventId);
    if (!eventToRemove) {
      toast.error("Evento non trovato");
      return;
    }

    // Update operators with event removed
    const updatedOperators = operators.map(operator => {
      if (operator.id === selectedOperator.id) {
        const currentEvents = operator.assignedEvents || [];
        return {
          ...operator,
          assignedEvents: currentEvents.filter(id => id !== eventId)
        };
      }
      return operator;
    });

    // Save updated operators to localStorage
    setOperators(updatedOperators);
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updatedOperators));

    // Remove shifts for this operator from the event
    updateEventShifts(eventId, selectedOperator.id, [], true);

    // Send email notification
    if (selectedOperator.email) {
      const eventDate = format(eventToRemove.startDate, "dd/MM/yyyy");
      await sendEmailNotification(
        selectedOperator.email,
        `${selectedOperator.name} ${selectedOperator.surname}`,
        eventToRemove.title,
        eventDate,
        'removal'
      );
    }

    toast.success(`Evento "${eventToRemove.title}" rimosso con successo`);
  };

  const triggerGlobalUpdate = () => {
    // Dispatch multiple events to ensure all components update
    window.dispatchEvent(new CustomEvent('operatorAssigned'));
    window.dispatchEvent(new CustomEvent('operatorDataUpdated'));
    
    const storageEvent = new StorageEvent('storage', {
      key: OPERATORS_STORAGE_KEY,
      newValue: safeLocalStorage.getItem(OPERATORS_STORAGE_KEY)
    });
    window.dispatchEvent(storageEvent);
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('operatorAssigned'));
    }, 100);
    
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('operatorDataUpdated'));
    }, 500);
  };

  const handleAssign = async () => {
    if (!selectedOperator || !selectedEventId) {
      toast.error("Seleziona un evento per continuare");
      return;
    }

    const eventId = parseInt(selectedEventId);
    const eventToAssign = events.find(e => e.id === eventId);
    
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
    
    // Save shifts for this operator to the event
    if (shifts.length > 0) {
      updateEventShifts(eventId, selectedOperator.id, shifts);
    }
    
    console.log("EventPlanner: Assignment completed, triggering global update");
    
    // Trigger comprehensive update
    triggerGlobalUpdate();

    // Send email notification
    if (selectedOperator.email && eventToAssign) {
      const eventDate = format(eventToAssign.startDate, "dd/MM/yyyy");
      await sendEmailNotification(
        selectedOperator.email,
        `${selectedOperator.name} ${selectedOperator.surname}`,
        eventToAssign.title,
        eventDate,
        'assignment'
      );
    }
    
    toast.success(`${selectedOperator.name} ${selectedOperator.surname} assegnato con successo all'evento`);
    
    // Navigate back after assignment
    setTimeout(() => {
      navigate("/operators");
    }, 1500);
  };

  // Enhanced addShift that updates events
  const handleAddShift = () => {
    const newShifts = addShift();
    if (newShifts && selectedOperator && selectedEventId) {
      updateEventShifts(parseInt(selectedEventId), selectedOperator.id, newShifts);
    }
  };

  // Enhanced removeShift that updates events
  const handleRemoveShift = (shiftId: string) => {
    const newShifts = removeShift(shiftId);
    if (newShifts && selectedOperator && selectedEventId) {
      updateEventShifts(parseInt(selectedEventId), selectedOperator.id, newShifts);
    }
  };

  return {
    // Data
    events,
    selectedOperator,
    selectedEventId,
    setSelectedEventId,
    selectedEvent,
    getAssignedEvents,
    notes,
    setNotes,
    
    // Shift management
    shifts,
    shiftDate,
    setShiftDate,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    addShift: handleAddShift,
    removeShift: handleRemoveShift,
    isDateInEventRange,
    
    // Actions
    handleRemoveEvent,
    handleAssign
  };
};
