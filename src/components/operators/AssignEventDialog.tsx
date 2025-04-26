
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event } from "@/types/event";
import { Operator } from "@/types/operator";

interface AssignEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assigningOperator: Operator | null;
  selectedEventId: string;
  setSelectedEventId: React.Dispatch<React.SetStateAction<string>>;
  events: Event[];
  onSubmit: (e: React.FormEvent) => void;
}

const AssignEventDialog: React.FC<AssignEventDialogProps> = ({
  open,
  onOpenChange,
  assigningOperator,
  selectedEventId,
  setSelectedEventId,
  events,
  onSubmit
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assegna {assigningOperator?.name} a un evento
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <Label htmlFor="event" className="font-medium">
              Seleziona evento
            </Label>
            <Select
              value={selectedEventId}
              onValueChange={setSelectedEventId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un evento" />
              </SelectTrigger>
              <SelectContent>
                {events.length > 0 ? (
                  events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-events" disabled>
                    Nessun evento disponibile
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            
            {selectedEventId && events.length > 0 && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                {(() => {
                  const event = events.find(e => e.id.toString() === selectedEventId);
                  if (!event) return null;
                  
                  return (
                    <div className="space-y-2">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Cliente: {event.client}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Data e ora: </span>
                        {formatDateRange(event.startDate, event.endDate)}
                      </div>
                      {event.location && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Località: </span>
                          {event.location}
                        </div>
                      )}
                      {event.address && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Indirizzo: </span>
                          {event.address}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button type="submit" disabled={!selectedEventId || events.length === 0}>
              Assegna
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignEventDialog;
