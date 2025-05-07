import { useState, useEffect } from "react";
import { Operator } from "@/types/operator";
import { safeLocalStorage } from "@/utils/fileUtils";
import { getOperators, saveOperators, OPERATORS_STORAGE_KEY } from "@/utils/operatorUtils";
import { toast } from "sonner";

export const useOperators = () => {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      name: "Mario Rossi",
      email: "mario.rossi@example.com",
      phone: "+39 123 456 7890",
      status: "active",
      assignedEvents: [],
    },
    {
      id: 2,
      name: "Luigi Verdi",
      email: "luigi.verdi@example.com",
      phone: "+39 098 765 4321",
      status: "inactive",
      assignedEvents: [],
    },
  ]);
  
  useEffect(() => {
    const storedOperators = getOperators();
    if (storedOperators.length > 0) {
      setOperators(storedOperators);
    } else {
      saveOperators(operators);
    }
  }, []);
  
  useEffect(() => {
    saveOperators(operators);
  }, [operators]);

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedOperatorId, setSelectedOperatorId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Open dialog for operator assignment
  const openAssignDialog = (operatorId: number, eventId: string | null) => {
    if (!eventId) {
      console.error("No event ID provided for operator assignment");
      return;
    }
    
    try {
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum)) {
        console.error("Invalid event ID format");
        return;
      }
      
      setSelectedOperatorId(operatorId);
      setSelectedEventId(eventId);
      setIsAssignDialogOpen(true);
    } catch (error) {
      console.error("Error in openAssignDialog:", error);
    }
  };

  const closeAssignDialog = () => {
    setIsAssignDialogOpen(false);
    setSelectedOperatorId(null);
    setSelectedEventId(null);
  };

  const assignOperatorToEvent = () => {
    if (selectedOperatorId && selectedEventId) {
      try {
        const eventIdNum = parseInt(selectedEventId);
        if (isNaN(eventIdNum)) {
          console.error("Invalid event ID format");
          toast.error("Invalid event ID format");
          return;
        }
        
        const updatedOperators = operators.map(op => {
          if (op.id === selectedOperatorId) {
            const assignedEvents = op.assignedEvents ? [...op.assignedEvents, eventIdNum] : [eventIdNum];
            return { ...op, assignedEvents: assignedEvents };
          }
          return op;
        });
        
        setOperators(updatedOperators);
        saveOperators(updatedOperators);
        closeAssignDialog();
        toast.success("Operator assigned to event successfully!");
      } catch (error) {
        console.error("Error assigning operator to event:", error);
        toast.error("Error assigning operator to event");
      }
    } else {
      console.error("Missing operator or event ID");
      toast.error("Missing operator or event ID");
    }
  };

  // Unassign operator from event
  const handleUnassignOperator = (operatorId: number, eventId: number) => {
    try {
      const updatedOperators = operators.map(op => {
        if (op.id === operatorId) {
          return {
            ...op,
            assignedEvents: op.assignedEvents 
              ? op.assignedEvents.filter(id => id !== eventId)
              : []
          };
        }
        return op;
      });
      
      setOperators(updatedOperators);
      saveOperators(updatedOperators);
      toast.success("Operatore rimosso dall'evento");
    } catch (error) {
      console.error("Error unassigning operator:", error);
      toast.error("Errore durante la rimozione dell'operatore dall'evento");
    }
  };

  return {
    operators,
    setOperators,
    openAssignDialog,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    selectedOperatorId,
    selectedEventId,
    setSelectedEventId,
    handleUnassignOperator
  };
};
