
import React from 'react';
import { Event } from "@/types/event";
import { calculateStaffKPI, getKpiColorClass } from "@/utils/eventTableUtils";

interface StaffKPIBadgeProps {
  event: Event;
  operators: any[];
  updateTrigger: number;
}

const StaffKPIBadge = ({ event, operators, updateTrigger }: StaffKPIBadgeProps) => {
  // Forza il ricalcolo ad ogni updateTrigger per garantire l'aggiornamento
  const kpi = React.useMemo(() => {
    return calculateStaffKPI(event, operators);
  }, [event, operators, updateTrigger]);
  
  console.log(`StaffKPIBadge render for event ${event.id}, trigger: ${updateTrigger}`, kpi);
  
  return (
    <span 
      key={`${event.id}-${updateTrigger}-${kpi.assigned}`}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKpiColorClass(kpi.percentage)}`}
    >
      {kpi.assigned} / {kpi.required} ({kpi.percentage}%)
    </span>
  );
};

export default StaffKPIBadge;
