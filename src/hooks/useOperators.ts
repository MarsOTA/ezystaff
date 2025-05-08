
import { useState, useEffect } from "react";
import { Operator } from "@/types/operator";
import { safeLocalStorage } from "@/utils/fileUtils";
import { getOperators, saveOperators, OPERATORS_STORAGE_KEY } from "@/utils/operatorUtils";
import { toast } from "sonner";
import { EVENTS_STORAGE_KEY } from "@/types/event";

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
          toast.error("Formato ID evento non valido");
          return;
        }
        
        const updatedOperators = operators.map(op => {
          if (op.id === selectedOperatorId) {
            // Check if already assigned to prevent duplicates
            if (op.assignedEvents && op.assignedEvents.includes(eventIdNum)) {
              return op;
            }
            
            const assignedEvents = op.assignedEvents ? [...op.assignedEvents, eventIdNum] : [eventIdNum];
            return { ...op, assignedEvents: assignedEvents };
          }
          return op;
        });
        
        setOperators(updatedOperators);
        saveOperators(updatedOperators);
        closeAssignDialog();
        toast.success("Operatore assegnato all'evento con successo!");
        return true;
      } catch (error) {
        console.error("Error assigning operator to event:", error);
        toast.error("Errore durante l'assegnazione dell'operatore all'evento");
        return false;
      }
    } else {
      console.error("Missing operator or event ID");
      toast.error("ID operatore o evento mancante");
      return false;
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
      return true;
    } catch (error) {
      console.error("Error unassigning operator:", error);
      toast.error("Errore durante la rimozione dell'operatore dall'evento");
      return false;
    }
  };

  // Check if an event overlaps with another based on dates
  const doEventsOverlap = (eventId1: number, eventId2: number) => {
    try {
      const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
      if (!storedEvents) return false;
      
      const events = JSON.parse(storedEvents);
      const event1 = events.find((e: any) => e.id === eventId1);
      const event2 = events.find((e: any) => e.id === eventId2);
      
      if (!event1 || !event2) return false;
      
      const start1 = new Date(event1.startDate);
      const end1 = new Date(event1.endDate);
      const start2 = new Date(event2.startDate);
      const end2 = new Date(event2.endDate);
      
      // Check if the events overlap
      return (start1 <= end2 && start2 <= end1);
    } catch (error) {
      console.error("Error checking event overlap:", error);
      return false;
    }
  };
  
  // Check if an operator is available for an event
  const isOperatorAvailable = (operatorId: number, eventId: number) => {
    const operator = operators.find(op => op.id === operatorId);
    if (!operator || !operator.assignedEvents) return true;
    
    // If already assigned to this event, consider available
    if (operator.assignedEvents.includes(eventId)) return true;
    
    // Check if operator is assigned to any overlapping events
    for (const assignedEventId of operator.assignedEvents) {
      if (doEventsOverlap(eventId, assignedEventId)) {
        return false;
      }
    }
    
    return true;
  };

  return {
    operators,
    setOperators,
    openAssignDialog,
    closeAssignDialog,
    assignOperatorToEvent,
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    selectedOperatorId,
    selectedEventId,
    setSelectedEventId,
    handleUnassignOperator,
    isOperatorAvailable,
    doEventsOverlap
  };
};
