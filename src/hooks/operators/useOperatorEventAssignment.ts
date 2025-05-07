import { useState } from "react";
import { toast } from "sonner";
import { Operator } from "@/types/operator";
import { Event } from "@/types/event";

export const useOperatorEventAssignment = (
  operators: Operator[], 
  setOperators: React.Dispatch<React.SetStateAction<Operator[]>>,
  events: Event[]
) => {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningOperator, setAssigningOperator] = useState<Operator | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  const openAssignDialog = (operator: Operator) => {
    setAssigningOperator(operator);
    setSelectedEventId("");
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assigningOperator || !selectedEventId) {
      toast.error("Seleziona un evento");
      return;
    }
    
    const eventId = parseInt(selectedEventId);
    
    setOperators((prev) =>
      prev.map((op) => {
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
      })
    );
    
    const eventName = events.find(e => e.id === eventId)?.title || "Evento selezionato";
    
    toast.success(`${assigningOperator.name} assegnato a "${eventName}"`);
    setIsAssignDialogOpen(false);
  };

  const handleUnassignOperator = (operatorId: number, eventId: number) => {
    setOperators((prev) =>
      prev.map((op) => {
        if (op.id === operatorId) {
          const currentAssignedEvents = op.assignedEvents || [];
          return {
            ...op,
            assignedEvents: currentAssignedEvents.filter(id => id !== eventId)
          };
        }
        return op;
      })
    );
    
    const operator = operators.find(op => op.id === operatorId);
    const event = events.find(e => e.id === eventId);
    
    if (operator && event) {
      toast.success(`${operator.name} rimosso da "${event.title}"`);
    } else {
      toast.success("Operatore rimosso dall'evento");
    }
  };

  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    assigningOperator,
    selectedEventId,
    setSelectedEventId,
    openAssignDialog,
    handleAssignSubmit,
    handleUnassignOperator
  };
};
