
import React from 'react';
import EventPlanner from '@/components/event/EventPlanner';

interface EventPlannerTabProps {
  selectedPersonnel: string[];
  onPersonnelChange: (personnelId: string) => void;
  personnelCounts: Record<string, number>;
  onPersonnelCountChange: (personnelId: string, count: number) => void;
  eventId: string | null;
}

const EventPlannerTab: React.FC<EventPlannerTabProps> = ({
  selectedPersonnel,
  onPersonnelChange,
  personnelCounts,
  onPersonnelCountChange,
  eventId
}) => {
  return (
    <EventPlanner 
      selectedPersonnel={selectedPersonnel}
      onPersonnelChange={onPersonnelChange}
      personnelCounts={personnelCounts}
      onPersonnelCountChange={onPersonnelCountChange}
      eventId={eventId}
    />
  );
};

export default EventPlannerTab;
