
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

  // Recalculate KPI whenever operators or triggers change
  const kpi = useMemo(() => {
    const currentOperators = localOperators.length > 0 ? localOperators : operators;
    
    console.log(`StaffKPIBadge: Calculating KPI for event ${event.id}`, {
      eventId: event.id,
      operatorsCount: currentOperators.length,
      updateTrigger,
      localUpdateTrigger,
      operatorsData: currentOperators.map(op => ({ 
        id: op.id, 
        name: op.name, 
        assignedEvents: op.assignedEvents 
      }))
    });

    const assignedOperatorsCount = currentOperators.filter((op: any) => 
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
  }, [event.id, event.personnelCounts, operators, localOperators, updateTrigger, localUpdateTrigger]);
  
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKpiColorClass(kpi.percentage)}`}
    >
      {kpi.assigned} / {kpi.required} ({kpi.percentage}%)
    </span>
  );
};

export default StaffKPIBadge;
