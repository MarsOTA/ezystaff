
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event } from "@/types/event";

export const formatDateRange = (start: Date, end: Date) => {
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

export const getStatusClass = (status?: string) => {
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

export const getStatusText = (status?: string) => {
  if (!status) return 'Programmato';
  
  switch(status) {
    case 'completed':
      return 'Completato';
    case 'cancelled':
      return 'Annullato';
    case 'in-progress':
      return 'In corso';
    default:
      return 'Programmato';
  }
};

export const calculateStaffKPI = (event: Event, operators: any[]) => {
  // Forza il calcolo sempre aggiornato senza cache
  const assignedOperatorsCount = operators.filter((op: any) => 
    op.assignedEvents && op.assignedEvents.includes(event.id)
  ).length;

  console.log(`EventTable: KPI calculation for event ${event.id}:`, {
    eventId: event.id,
    assignedOperators: operators.filter((op: any) => 
      op.assignedEvents && op.assignedEvents.includes(event.id)
    ).map(op => ({ id: op.id, name: op.name, assignedEvents: op.assignedEvents })),
    assignedCount: assignedOperatorsCount,
    totalOperators: operators.length,
    timestamp: new Date().toISOString()
  });

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

export const getKpiColorClass = (percentage: number) => {
  if (percentage >= 100) return "bg-green-100 text-green-800";
  if (percentage >= 75) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
};
