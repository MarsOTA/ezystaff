
import React, { useMemo } from 'react';
import { useOperators } from "@/hooks/useOperators";
import PersonnelTypes from './personnel/PersonnelTypes';
import OperatorsTable from './personnel/OperatorsTable';
import AssignedOperatorsList from './personnel/AssignedOperatorsList';

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
  const { operators, openAssignDialog, handleUnassignOperator } = useOperators();
  
  // Get assigned operators for this event (if eventId exists and is a number)
  const assignedOperators = useMemo(() => {
    if (!eventId) return [];
    const eventIdNum = parseInt(eventId);
    return operators.filter(op => 
      op.assignedEvents && op.assignedEvents.includes(eventIdNum)
    );
  }, [operators, eventId]);

  return (
    <div className="space-y-6">
      {/* Personnel Types Selection with Counters */}
      <PersonnelTypes
        selectedPersonnel={selectedPersonnel}
        onPersonnelChange={onPersonnelChange}
        personnelCounts={personnelCounts}
        onPersonnelCountChange={onPersonnelCountChange}
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
    </div>
  );
};

export default EventPlanner;
