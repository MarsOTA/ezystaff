
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";

interface EventSelectionProps {
  selectedOperator: Operator;
  events: Event[];
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
}

const EventSelection: React.FC<EventSelectionProps> = ({
  selectedOperator,
  events,
  selectedEventId,
  onEventChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Seleziona l'evento a cui vuoi assegnare {selectedOperator.name} {selectedOperator.surname}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedEventId} onValueChange={onEventChange}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona un evento" />
          </SelectTrigger>
          <SelectContent>
            {events.length > 0 ? (
              events.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  {event.title} - {event.client}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-events" disabled>
                Nessun evento disponibile
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default EventSelection;
