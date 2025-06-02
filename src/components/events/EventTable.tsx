import React from 'react';
import { format } from "date-fns";
import { it } from "date-fns/locale";
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
import { useOperatorStorage } from '@/hooks/operators/useOperatorStorage';

interface EventTableProps {
  events: Event[];
  onShowDetails: (event: Event) => void;
  onEditEvent: (e: React.MouseEvent, eventId: number) => void;
  onDeleteEvent: (e: React.MouseEvent, eventId: number) => void;
}

const EventTable = ({ events, onShowDetails, onEditEvent, onDeleteEvent }: EventTableProps) => {
  const { operators } = useOperatorStorage();
  
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

  // Function to get status class
  const getStatusClass = (status?: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Calculate staff KPI for an event - updated to force re-calculation
  const calculateStaffKPI = (event: Event) => {
    // Count assigned operators for this specific event
    const assignedOperatorsCount = operators.filter(op => 
      op.assignedEvents && op.assignedEvents.includes(event.id)
    ).length;

    // Calculate total required personnel from event data
    const totalRequired = event.personnelCounts ? 
      Object.values(event.personnelCounts).reduce((sum, count) => sum + count, 0) : 0;

    // Return both numbers and percentage
    return {
      assigned: assignedOperatorsCount,
      required: totalRequired,
      percentage: totalRequired > 0 ? Math.round((assignedOperatorsCount / totalRequired) * 100) : 0
    };
  };

  // Get color class for KPI based on percentage
  const getKpiColorClass = (percentage: number) => {
    if (percentage >= 100) return "bg-green-100 text-green-800";
    if (percentage >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

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
        {events.map((event) => {
          const kpi = calculateStaffKPI(event);
          return (
            <TableRow 
              key={event.id} 
              className="cursor-pointer hover:bg-muted/50" 
              onClick={() => onShowDetails(event)}
            >
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.client}</TableCell>
              <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(event.status)}`}>
                  {event.status ? (
                    event.status === 'completed' ? 'Completato' :
                    event.status === 'cancelled' ? 'Annullato' :
                    event.status === 'in-progress' ? 'In corso' : 'Programmato'
                  ) : 'Programmato'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKpiColorClass(kpi.percentage)}`}>
                  {kpi.assigned} / {kpi.required} ({kpi.percentage}%)
                </span>
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
          );
        })}
      </TableBody>
    </Table>
  );
};

export default EventTable;
