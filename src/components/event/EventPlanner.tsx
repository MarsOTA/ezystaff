
import React, { useMemo, useEffect, useState } from 'react';
import { useOperators } from "@/hooks/useOperators";
import PersonnelTypes from './personnel/PersonnelTypes';
import OperatorsTable from './personnel/OperatorsTable';
import AssignedOperatorsList from './personnel/AssignedOperatorsList';
import { Operator } from '@/types/operator';
import { toast } from "sonner";

interface EventPlannerProps {
  selectedPersonnel: string[];
  onPersonnelChange: (personnelId: string) => void;
  personnelCounts: Record<string, number>;
  onPersonnelCountChange: (personnelId: string, count: number) => void;
  eventId: string | null;
}

const EventPlanner: React.FC<EventPlannerProps> = ({
  selectedPersonnel,
  onPersonnelChange,
  personnelCounts,
  onPersonnelCountChange,
  eventId
}) => {
  // Use local state to track operators and assignments
  const { operators, openAssignDialog: baseOpenAssignDialog, handleUnassignOperator: baseHandleUnassignOperator, isAssignDialogOpen, setIsAssignDialogOpen } = useOperators();
  
  // Local state to prevent unnecessary rerenders
  const [localOperators, setLocalOperators] = useState<Operator[]>([]);
  
  // Update local operators whenever the main operators change
  useEffect(() => {
    setLocalOperators(operators);
  }, [operators]);
  
  // Get assigned operators for this event (if eventId exists and is a number)
  const assignedOperators = useMemo(() => {
    if (!eventId) return [];
    
    try {
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum)) return [];
      
      return localOperators.filter(op => 
        op.assignedEvents && op.assignedEvents.includes(eventIdNum)
      );
    } catch (error) {
      console.error("Error parsing event ID:", error);
      return [];
    }
  }, [localOperators, eventId]);
  
  // Wrap the openAssignDialog function to prevent form submission and match the expected signature
  const handleOpenAssignDialog = (operator: Operator) => {
    if (eventId) {
      baseOpenAssignDialog(operator.id, eventId);
    }
  };
  
  // Wrap the unassign function to update local state immediately
  const handleUnassignOperator = (operatorId: number, eventId: number) => {
    // First call the base function to update storage
    baseHandleUnassignOperator(operatorId, eventId);
    
    // Then update local state for immediate UI feedback
    setLocalOperators(prevOperators => 
      prevOperators.map(op => {
        if (op.id === operatorId) {
          return {
            ...op,
            assignedEvents: op.assignedEvents ? op.assignedEvents.filter(id => id !== eventId) : []
          };
        }
        return op;
      })
    );
    
    toast.success("Operatore rimosso dall'evento");
  };
  
  // Handle assignment confirmation with local state update
  useEffect(() => {
    if (!isAssignDialogOpen && localOperators.length > 0) {
      // This will re-calculate the assigned operators when the dialog closes
      // by forcing a re-evaluation of our local operators state
      setLocalOperators([...localOperators]);
    }
  }, [isAssignDialogOpen]);

  // Prevent form submission on personnel count changes
  const handlePersonnelCountChange = (personnelId: string, count: number) => {
    try {
      // Call the parent handler but prevent event propagation
      onPersonnelCountChange(personnelId, count);
    } catch (error) {
      console.error("Error changing personnel count:", error);
      toast.error("Errore durante l'aggiornamento del conteggio");
    }
  };

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      {/* Personnel Types Selection with Counters */}
      <PersonnelTypes
        selectedPersonnel={selectedPersonnel}
        onPersonnelChange={onPersonnelChange}
        personnelCounts={personnelCounts}
        onPersonnelCountChange={handlePersonnelCountChange}
      />

      {/* Personnel Selection Table */}
      <OperatorsTable
        operators={localOperators}
        eventId={eventId}
        openAssignDialog={handleOpenAssignDialog}
        handleUnassignOperator={handleUnassignOperator}
      />

      {/* Assigned Personnel List */}
      <AssignedOperatorsList
        assignedOperators={assignedOperators}
        eventId={eventId}
        handleUnassignOperator={handleUnassignOperator}
      />
    </div>
  );
};

export default EventPlanner;
