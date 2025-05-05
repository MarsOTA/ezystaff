
import { useState } from "react";
import { toast } from "sonner";
import { Operator } from "@/types/operator";
import { Event } from "@/pages/Events";

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

  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    assigningOperator,
    selectedEventId,
    setSelectedEventId,
    openAssignDialog,
    handleAssignSubmit
  };
};
