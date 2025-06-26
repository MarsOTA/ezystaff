
import React from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, Users } from "lucide-react";
import { Event } from "@/types/event";
import EventStatusBadge from "./EventStatusBadge";
import StaffKPIBadge from "./StaffKPIBadge";
import { useNavigate } from "react-router-dom";
import { useOperatorData } from "@/hooks/useOperatorData";

interface EventTableProps {
  events: Event[];
  onShowDetails: (event: Event) => void;
  onEditEvent: (e: React.MouseEvent, eventId: number) => void;
  onDeleteEvent: (e: React.MouseEvent, eventId: number) => void;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  onShowDetails,
  onEditEvent,
  onDeleteEvent
}) => {
  const navigate = useNavigate();
  const { operators, updateTrigger } = useOperatorData();

  const handleSchedulingClick = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    navigate(`/events/scheduling/${eventId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-medium">Titolo</th>
            <th className="text-left p-4 font-medium">Cliente</th>
            <th className="text-left p-4 font-medium">Data inizio</th>
            <th className="text-left p-4 font-medium">Data fine</th>
            <th className="text-left p-4 font-medium">Stato</th>
            <th className="text-left p-4 font-medium">Staff</th>
            <th className="text-left p-4 font-medium">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b hover:bg-muted/50 cursor-pointer"
              onClick={() => onShowDetails(event)}
            >
              <td className="p-4 font-medium">{event.title}</td>
              <td className="p-4">{event.client}</td>
              <td className="p-4">
                {format(event.startDate, "d MMM yyyy", { locale: it })}
              </td>
              <td className="p-4">
                {format(event.endDate, "d MMM yyyy", { locale: it })}
              </td>
              <td className="p-4">
                <EventStatusBadge status={event.status} />
              </td>
              <td className="p-4">
                <StaffKPIBadge 
                  event={event} 
                  operators={operators}
                  updateTrigger={updateTrigger}
                />
              </td>
              <td className="p-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleSchedulingClick(e, event.id)}
                    title="Programmazione"
                  >
                    <Calendar className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => onEditEvent(e, event.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => onDeleteEvent(e, event.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
