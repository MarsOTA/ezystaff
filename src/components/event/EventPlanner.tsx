
import React, { useMemo, useEffect, useState } from 'react';
import { useOperatorStorage } from "@/hooks/operators/useOperatorStorage";
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
  // Use operator storage for operators and events data
  const { operators, setOperators, events } = useOperatorStorage();
  
  // Get assigned operators for this event (if eventId exists)
  const assignedOperators = useMemo(() => {
    if (!eventId) return [];
    
    try {
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum)) return [];
      
      return operators.filter(op => 
        op.assignedEvents && op.assignedEvents.includes(eventIdNum)
      );
    } catch (error) {
      console.error("Error parsing event ID:", error);
      return [];
    }
  }, [operators, eventId]);
  
  // Direct assignment without dialog - simplified for Event Planner context
  const handleDirectAssign = (operator: Operator) => {
    if (!eventId) {
      toast.error("Impossibile assegnare l'operatore all'evento");
      return;
    }
    
    try {
      const eventIdNum = parseInt(eventId);
      if (isNaN(eventIdNum)) {
        toast.error("ID evento non valido");
        return;
      }
      
      // Update operators state with the new assignment
      const updatedOperators = operators.map(op => {
        if (op.id === operator.id) {
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
      });
      
      // Update state and storage
      setOperators(updatedOperators);
      
      const eventName = events.find(e => e.id === eventIdNum)?.title || "Evento corrente";
      toast.success(`${operator.name} assegnato a "${eventName}"`);
    } catch (error) {
      console.error("Error assigning operator:", error);
      toast.error("Errore durante l'assegnazione dell'operatore");
    }
  };
  
  // Unassign operator from event
  const handleUnassignOperator = (operatorId: number, eventId: number) => {
    // Update operators state with the operator removed from this event
    const updatedOperators = operators.map(op => {
      if (op.id === operatorId) {
        return {
          ...op,
          assignedEvents: op.assignedEvents ? op.assignedEvents.filter(id => id !== eventId) : []
        };
      }
      return op;
    });
    
    // Update state and storage
    setOperators(updatedOperators);
    
    const operator = operators.find(op => op.id === operatorId);
    const event = events.find(e => e.id === eventId);
    
    if (operator && event) {
      toast.success(`${operator.name} rimosso da "${event.title}"`);
    } else {
      toast.success("Operatore rimosso dall'evento");
    }
  };

  // Prevent form submission on personnel count changes
  const handlePersonnelCountChange = (e: React.MouseEvent, personnelId: string, count: number) => {
    e.preventDefault();
    e.stopPropagation();
    onPersonnelCountChange(personnelId, count);
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
        operators={operators}
        eventId={eventId}
        openAssignDialog={handleDirectAssign}
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
