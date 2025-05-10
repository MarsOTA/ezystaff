
import React, { useMemo } from 'react';
import { useOperatorStorage } from "@/hooks/operators/useOperatorStorage";
import PersonnelTypes from './personnel/PersonnelTypes';
import OperatorsTable from './personnel/OperatorsTable';
import AssignedOperatorsList from './personnel/AssignedOperatorsList';
import AssignEventDialog from '../operators/AssignEventDialog';
import { useOperatorAssignment } from '@/hooks/events/useOperatorAssignment';

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
  // Get operators data
  const { operators } = useOperatorStorage();
  
  // Use our custom hook for operator assignment logic
  const {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    assigningOperator,
    openAssignDialog,
    handleAssignSubmit,
    handleUnassignOperator,
    events
  } = useOperatorAssignment(eventId);
  
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
        selectedEventId={eventId || ""}
        setSelectedEventId={() => {}} // Not needed here since we're using the current event
        events={eventId ? events.filter(e => e.id.toString() === eventId) : []}
        onSubmit={handleAssignSubmit}
      />
    </div>
  );
};

export default EventPlanner;
