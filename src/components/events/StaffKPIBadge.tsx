
import React, { useMemo, useEffect, useState } from 'react';
import { Event } from "@/types/event";
import { getKpiColorClass } from "@/utils/eventTableUtils";
import { safeLocalStorage } from "@/utils/fileUtils";
import { OPERATORS_STORAGE_KEY } from "@/types/operator";

interface StaffKPIBadgeProps {
  event: Event;
  operators: any[];
  updateTrigger: number;
}

const StaffKPIBadge = ({ event, operators, updateTrigger }: StaffKPIBadgeProps) => {
  const [localOperators, setLocalOperators] = useState<any[]>([]);
  const [localUpdateTrigger, setLocalUpdateTrigger] = useState(0);

  // Force refresh of operators data
  const refreshOperators = () => {
    const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      try {
        const parsedOperators = JSON.parse(storedOperators);
        setLocalOperators(parsedOperators);
        setLocalUpdateTrigger(prev => prev + 1);
        console.log(`StaffKPIBadge: Refreshed operators for event ${event.id}`, parsedOperators);
      } catch (error) {
        console.error("Error parsing operators:", error);
        setLocalOperators(operators);
      }
    } else {
      setLocalOperators(operators);
    }
  };

  // Initialize with current operators
  useEffect(() => {
    setLocalOperators(operators);
  }, [operators]);

  // Listen for all possible update events
  useEffect(() => {
    const handleUpdate = () => {
      console.log(`StaffKPIBadge: Update event received for event ${event.id}`);
      refreshOperators();
    };

    window.addEventListener('operatorAssigned', handleUpdate);
    window.addEventListener('operatorDataUpdated', handleUpdate);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OPERATORS_STORAGE_KEY) {
        console.log(`StaffKPIBadge: Storage change detected for event ${event.id}`);
        refreshOperators();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('operatorAssigned', handleUpdate);
      window.removeEventListener('operatorDataUpdated', handleUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [event.id]);

  // Calculate hours-based KPI
  const kpi = useMemo(() => {
    const currentOperators = localOperators.length > 0 ? localOperators : operators;
    
    console.log(`StaffKPIBadge: Calculating hours KPI for event ${event.id}`, {
      eventId: event.id,
      operatorsCount: currentOperators.length,
      updateTrigger,
      localUpdateTrigger,
      totalScheduledHours: event.totalScheduledHours
    });

    // Get total planned hours from event scheduling
    const totalPlannedHours = event.totalScheduledHours || 0;

    // Calculate assigned hours based on operators assigned to this event
    const assignedOperators = currentOperators.filter((op: any) => 
      op.assignedEvents && Array.isArray(op.assignedEvents) && op.assignedEvents.includes(event.id)
    );

    // For now, assume each assigned operator works the full planned hours
    // This is a simplified calculation - in a real scenario, you might have 
    // more detailed shift assignments per operator
    const assignedHours = assignedOperators.length * totalPlannedHours;

    const result = {
      assigned: assignedHours,
      total: totalPlannedHours,
      percentage: totalPlannedHours > 0 ? Math.round((assignedHours / totalPlannedHours) * 100) : 0
    };

    console.log(`StaffKPIBadge: Hours KPI result for event ${event.id}:`, result);
    return result;
  }, [event.id, event.totalScheduledHours, operators, localOperators, updateTrigger, localUpdateTrigger]);
  
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKpiColorClass(kpi.percentage)}`}
    >
      {kpi.assigned}h / {kpi.total}h ({kpi.percentage}%)
    </span>
  );
};

export default StaffKPIBadge;
