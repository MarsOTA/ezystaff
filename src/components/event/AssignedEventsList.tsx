
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/types/event";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface AssignedEventsListProps {
  assignedEvents: Event[];
}

const AssignedEventsList: React.FC<AssignedEventsListProps> = ({
  assignedEvents
}) => {
  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.getDate() === end.getDate() && 
                    start.getMonth() === end.getMonth() && 
                    start.getFullYear() === end.getFullYear();
    
    const startDateStr = format(start, "d MMMM yyyy", { locale: it });
    const endDateStr = format(end, "d MMMM yyyy", { locale: it });
    const startTimeStr = format(start, "HH:mm");
    const endTimeStr = format(end, "HH:mm");
    
    if (sameDay) {
      return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
      return `Dal ${startDateStr}, ${startTimeStr} al ${endDateStr}, ${endTimeStr}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventi già assegnati</CardTitle>
      </CardHeader>
      <CardContent>
        {assignedEvents.length > 0 ? (
          <div className="space-y-3">
            {assignedEvents.map((event) => (
              <div key={event.id} className="p-3 bg-muted rounded-md">
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDateRange(event.startDate, event.endDate)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nessun evento assegnato</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignedEventsList;
