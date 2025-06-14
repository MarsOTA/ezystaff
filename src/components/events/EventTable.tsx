
import React from 'react';
import { Event } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOperatorData } from "@/hooks/useOperatorData";
import { formatDateRange } from "@/utils/eventTableUtils";
import StaffKPIBadge from "./StaffKPIBadge";
import EventStatusBadge from "./EventStatusBadge";

interface EventTableProps {
  events: Event[];
  onShowDetails: (event: Event) => void;
  onEditEvent: (e: React.MouseEvent, eventId: number) => void;
  onDeleteEvent: (e: React.MouseEvent, eventId: number) => void;
}

const EventTable = ({ events, onShowDetails, onEditEvent, onDeleteEvent }: EventTableProps) => {
  const { operators, updateTrigger } = useOperatorData();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titolo Evento</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Data e Ora</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Staff KPI</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow 
            key={`${event.id}-${updateTrigger}`}
            className="cursor-pointer hover:bg-muted/50" 
            onClick={() => onShowDetails(event)}
          >
            <TableCell className="font-medium">{event.title}</TableCell>
            <TableCell>{event.client}</TableCell>
            <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
            <TableCell>
              <EventStatusBadge status={event.status} />
            </TableCell>
            <TableCell>
              <StaffKPIBadge 
                event={event} 
                operators={operators} 
                updateTrigger={updateTrigger} 
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditEvent(e, event.id);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEvent(e, event.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventTable;
