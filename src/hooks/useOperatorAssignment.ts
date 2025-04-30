
import { useState } from "react";
import { toast } from "sonner";
import { Operator } from "@/types/operator";
import { Event } from "@/types/event";
import { saveOperators, saveEvents, ATTENDANCE_RECORDS_KEY } from "@/utils/operatorUtils";
import { safeLocalStorage } from "@/utils/fileUtils";
import { useNavigate } from "react-router-dom";

export const useOperatorAssignment = (
  operators: Operator[],
  setOperators: React.Dispatch<React.SetStateAction<Operator[]>>,
  events: Event[],
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningOperator, setAssigningOperator] = useState<Operator | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  
  const navigate = useNavigate();

  /**
   * Open dialog to assign an operator to an event
   */
  const openAssignDialog = (operator: Operator) => {
    setAssigningOperator(operator);
    setSelectedEventId("");
    setIsAssignDialogOpen(true);
  };

  /**
   * Navigate to operator profile page
   */
  const handleEdit = (operator: Operator) => {
    navigate(`/operator-profile/${operator.id}`);
  };

  /**
   * Handle assignment of operator to event
   */
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assigningOperator || !selectedEventId) {
      toast.error("Seleziona un evento");
      return;
    }
    
    const eventId = parseInt(selectedEventId);
    
    // Update operators with new assignment
    const updatedOperators = operators.map((op) => {
      if (op.id === assigningOperator.id) {
        const currentAssignedEvents = op.assignedEvents || [];
        if (currentAssignedEvents.includes(eventId)) {
          toast.info("Operatore già assegnato a questo evento");
          return op;
        }
        
        return {
          ...op,
          assignedEvents: [...currentAssignedEvents, eventId]
        };
      }
      return op;
    });
    
    setOperators(updatedOperators);
    saveOperators(updatedOperators);
    
    // Also update events to include the assigned operator in assignedOperators array
    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        const currentAssignedOperators = event.assignedOperators || [];
        const operatorAlreadyAssigned = currentAssignedOperators.some(
          (op) => op.id === assigningOperator.id
        );
        
        if (!operatorAlreadyAssigned) {
          return {
            ...event,
            assignedOperators: [
              ...currentAssignedOperators,
              {
                id: assigningOperator.id,
                name: assigningOperator.name,
                email: assigningOperator.email,
              }
            ]
          };
        }
      }
      return event;
    });
    
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    
    // Ensure the attendance records are initialized
    const attendanceRecords = safeLocalStorage.getItem(ATTENDANCE_RECORDS_KEY);
    if (!attendanceRecords) {
      safeLocalStorage.setItem(ATTENDANCE_RECORDS_KEY, JSON.stringify([]));
    }
    
    const eventName = events.find(e => e.id === eventId)?.title || "Evento selezionato";
    
    toast.success(`${assigningOperator.name} assegnato a "${eventName}"`);
    setIsAssignDialogOpen(false);
  };

  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    assigningOperator,
    setAssigningOperator,
    selectedEventId,
    setSelectedEventId,
    openAssignDialog,
    handleAssignSubmit,
    handleEdit,
  };
};
