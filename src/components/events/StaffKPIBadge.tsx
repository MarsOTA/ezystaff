
import React from 'react';
import { Event } from "@/types/event";
import { calculateStaffKPI, getKpiColorClass } from "@/utils/eventTableUtils";

interface StaffKPIBadgeProps {
  event: Event;
  operators: any[];
  updateTrigger: number;
}

const StaffKPIBadge = ({ event, operators, updateTrigger }: StaffKPIBadgeProps) => {
  const kpi = calculateStaffKPI(event, operators, updateTrigger);
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKpiColorClass(kpi.percentage)}`}>
      {kpi.assigned} / {kpi.required} ({kpi.percentage}%)
    </span>
  );
};

export default StaffKPIBadge;
