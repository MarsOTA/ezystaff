
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
  // Calculate assigned operators for this event
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

  // Get total planned hours from event scheduling (monte ore evento)
  const totalPlannedHours = event.totalScheduledHours || 0;

  // Calculate assigned hours (ore assegnate tramite i turni operatore)
  const assignedHours = assignedOperatorsCount * totalPlannedHours;

  // Calculate total required hours (monte ore totale dei dipendenti previsti)
  const totalRequiredHours = event.personnelCounts ? 
    Object.values(event.personnelCounts).reduce((sum, count) => sum + count, 0) * totalPlannedHours : 
    totalPlannedHours;

  const percentage = totalRequiredHours > 0 ? Math.round((assignedHours / totalRequiredHours) * 100) : 0;

  return {
    assigned: assignedHours,
    total: totalRequiredHours,
    percentage
  };
};

export const getKpiColorClass = (percentage: number) => {
  if (percentage >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (percentage >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
};
