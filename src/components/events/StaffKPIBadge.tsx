
import React, { useMemo } from 'react';
import { Event } from "@/types/event";
import { getKpiColorClass } from "@/utils/eventTableUtils";

interface StaffKPIBadgeProps {
  event: Event;
  operators: any[];
  updateTrigger: number;
}

const StaffKPIBadge = ({ event, operators, updateTrigger }: StaffKPIBadgeProps) => {
  // Force recalculation on any change
  const kpi = useMemo(() => {
    console.log(`StaffKPIBadge: Calculating KPI for event ${event.id}`, {
      eventId: event.id,
      operators: operators.length,
      updateTrigger,
      operatorsData: operators.map(op => ({ 
        id: op.id, 
        name: op.name, 
        assignedEvents: op.assignedEvents 
      }))
    });

    const assignedOperatorsCount = operators.filter((op: any) => 
      op.assignedEvents && Array.isArray(op.assignedEvents) && op.assignedEvents.includes(event.id)
    ).length;

    // Calculate total required personnel from event data
    const totalRequired = event.personnelCounts ? 
      Object.values(event.personnelCounts).reduce((sum, count) => sum + count, 0) : 0;

    const result = {
      assigned: assignedOperatorsCount,
      required: totalRequired,
      percentage: totalRequired > 0 ? Math.round((assignedOperatorsCount / totalRequired) * 100) : 0
    };

    console.log(`StaffKPIBadge: KPI result for event ${event.id}:`, result);
    return result;
  }, [event.id, event.personnelCounts, operators, updateTrigger]);
  
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKpiColorClass(kpi.percentage)}`}
    >
      {kpi.assigned} / {kpi.required} ({kpi.percentage}%)
    </span>
  );
};

export default StaffKPIBadge;
