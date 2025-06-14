
import React, { useMemo } from 'react';
import { Event } from "@/types/event";
import { getKpiColorClass } from "@/utils/eventTableUtils";

interface StaffKPIBadgeProps {
  event: Event;
  operators: any[];
  updateTrigger: number;
}

const StaffKPIBadge = ({ event, operators, updateTrigger }: StaffKPIBadgeProps) => {
  // Forza il ricalcolo del KPI ogni volta che cambiano operators o updateTrigger
  const kpi = useMemo(() => {
    const assignedOperatorsCount = operators.filter((op: any) => 
      op.assignedEvents && op.assignedEvents.includes(event.id)
    ).length;

    console.log(`StaffKPIBadge: KPI calculation for event ${event.id}:`, {
      eventId: event.id,
      assignedOperators: operators.filter((op: any) => 
        op.assignedEvents && op.assignedEvents.includes(event.id)
      ).map(op => ({ id: op.id, name: op.name, assignedEvents: op.assignedEvents })),
      assignedCount: assignedOperatorsCount,
      totalOperators: operators.length,
      updateTrigger,
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
