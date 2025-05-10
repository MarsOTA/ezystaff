
import { useState } from "react";
import { useOperatorStorage } from "@/hooks/operators/useOperatorStorage";
import { Operator } from "@/types/operator";
import { toast } from "sonner";

export const useOperatorAssignment = (eventId: string | null) => {
  const { operators, setOperators, events } = useOperatorStorage();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningOperator, setAssigningOperator] = useState<Operator | null>(null);

  // Open assignment dialog for an operator
  const openAssignDialog = (operator: Operator) => {
    setAssigningOperator(operator);
    setIsAssignDialogOpen(true);
  };

  // Handle dialog submission to assign operator to event
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!assigningOperator || !eventId) {
      toast.error("Impossibile assegnare l'operatore all'evento");
      return;
    }
    
    try {
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum)) {
        toast.error("ID evento non valido");
        return;
      }
      
      // Update operators state
      setOperators(prev => 
        prev.map(op => {
          if (op.id === assigningOperator.id) {
            const currentAssignedEvents = op.assignedEvents || [];
            if (currentAssignedEvents.includes(eventIdNum)) {
              toast.info("Operatore già assegnato a questo evento");
              return op;
            }
            
            return {
              ...op,
              assignedEvents: [...currentAssignedEvents, eventIdNum]
            };
          }
          return op;
        })
      );
      
      const eventName = events.find(e => e.id === eventIdNum)?.title || "Evento corrente";
      toast.success(`${assigningOperator.name} assegnato a "${eventName}"`);
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error("Error assigning operator:", error);
      toast.error("Errore durante l'assegnazione dell'operatore");
    }
  };

  // Unassign operator from event
  const handleUnassignOperator = (operatorId: number, eventId: number) => {
    setOperators(prev => 
      prev.map(op => {
        if (op.id === operatorId) {
          return {
            ...op,
            assignedEvents: op.assignedEvents ? op.assignedEvents.filter(id => id !== eventId) : []
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
    openAssignDialog,
    handleAssignSubmit,
    handleUnassignOperator,
    events
  };
};
