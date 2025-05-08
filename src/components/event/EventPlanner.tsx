
import React, { useMemo, useEffect, useState } from 'react';
import { useOperators } from "@/hooks/useOperators";
import PersonnelTypes from './personnel/PersonnelTypes';
import OperatorsTable from './personnel/OperatorsTable';
import AssignedOperatorsList from './personnel/AssignedOperatorsList';
import { Operator } from '@/types/operator';
import { toast } from "sonner";
import AssignEventDialog from '../operators/AssignEventDialog';
import { useOperatorStorage } from '@/hooks/operators/useOperatorStorage';

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
  // Use operator storage for operators and events data
  const { operators: baseOperators, setOperators, events } = useOperatorStorage();
  
  // Local state for operators
  const [localOperators, setLocalOperators] = useState<Operator[]>([]);
  
  // Dialog state
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assigningOperator, setAssigningOperator] = useState<Operator | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  
  // Update local operators whenever the base operators change
  useEffect(() => {
    setLocalOperators(baseOperators);
  }, [baseOperators]);
  
  // Get assigned operators for this event (if eventId exists)
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
  
  // Open assignment dialog for an operator
  const openAssignDialog = (operator: Operator) => {
    setAssigningOperator(operator);
    setSelectedEventId(eventId || "");
    setIsAssignDialogOpen(true);
  };
  
  // Handle dialog submission to assign operator to event
  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assigningOperator || !selectedEventId) {
      toast.error("Seleziona un evento");
      return;
    }
    
    try {
      const eventIdNum = parseInt(selectedEventId);
      
      // Update local operators state first for immediate UI feedback
      setLocalOperators(prev => 
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
      
      // Also update the main operators state
      setOperators(prev => 
        prev.map(op => {
          if (op.id === assigningOperator.id) {
            const currentAssignedEvents = op.assignedEvents || [];
            if (currentAssignedEvents.includes(eventIdNum)) {
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
      
      const eventName = events.find(e => e.id === eventIdNum)?.title || "Evento selezionato";
      toast.success(`${assigningOperator.name} assegnato a "${eventName}"`);
      setIsAssignDialogOpen(false);
    } catch (error) {
      console.error("Error assigning operator:", error);
      toast.error("Errore durante l'assegnazione dell'operatore");
    }
  };
  
  // Unassign operator from event
  const handleUnassignOperator = (operatorId: number, eventId: number) => {
    // Update local operators state first for immediate UI feedback
    setLocalOperators(prev => 
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
    
    // Also update the main operators state
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
    
    const operator = localOperators.find(op => op.id === operatorId);
    const event = events.find(e => e.id === eventId);
    
    if (operator && event) {
      toast.success(`${operator.name} rimosso da "${event.title}"`);
    } else {
      toast.success("Operatore rimosso dall'evento");
    }
  };

  // Prevent form submission on personnel count changes
  const handlePersonnelCountChange = (e: React.MouseEvent, personnelId: string, count: number) => {
    try {
      e.preventDefault();
      e.stopPropagation();
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
        openAssignDialog={openAssignDialog}
        handleUnassignOperator={handleUnassignOperator}
      />

      {/* Assigned Personnel List */}
      <AssignedOperatorsList
        assignedOperators={assignedOperators}
        eventId={eventId}
        handleUnassignOperator={handleUnassignOperator}
      />
      
      {/* Assignment Dialog */}
      <AssignEventDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        assigningOperator={assigningOperator}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        events={events.filter(e => e.id.toString() === eventId)} // Only show current event
        onSubmit={handleAssignSubmit}
      />
    </div>
  );
};

export default EventPlanner;
