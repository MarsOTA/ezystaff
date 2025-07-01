
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";

interface EventSelectionProps {
  selectedOperator: Operator;
  events: Event[];
  selectedEventId: string;
  onEventChange: (eventId: string) => void;
  selectedEvent: Event | null;
  onTeamLeaderChange: (isTeamLeader: boolean) => void;
}

const EventSelection: React.FC<EventSelectionProps> = ({
  selectedOperator,
  events,
  selectedEventId,
  onEventChange,
  selectedEvent,
  onTeamLeaderChange
}) => {
  const isCurrentTeamLeader = selectedEvent?.teamLeaderId === selectedOperator.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Seleziona l'evento a cui vuoi assegnare {selectedOperator.name} {selectedOperator.surname}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        {selectedEventId && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="team-leader" className="text-sm font-medium">
                Team Leader dell'evento
              </Label>
              <p className="text-xs text-muted-foreground">
                Indica se {selectedOperator.name} {selectedOperator.surname} sarà il Team Leader per questo evento
              </p>
            </div>
            <Switch
              id="team-leader"
              checked={isCurrentTeamLeader}
              onCheckedChange={onTeamLeaderChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventSelection;
