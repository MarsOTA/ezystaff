
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/event";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { X } from "lucide-react";

interface AssignedEventsListProps {
  assignedEvents: Event[];
  onRemoveEvent?: (eventId: number) => void;
}

const AssignedEventsList: React.FC<AssignedEventsListProps> = ({
  assignedEvents,
  onRemoveEvent
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
              <div key={event.id} className="p-3 bg-muted rounded-md flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDateRange(event.startDate, event.endDate)}
                  </div>
                </div>
                {onRemoveEvent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => onRemoveEvent(event.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
