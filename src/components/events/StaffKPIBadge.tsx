
import React, { useMemo, useEffect, useState } from 'react';
import { Event } from "@/types/event";
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

    // Get total planned hours from event scheduling (monte ore evento)
    const totalPlannedHours = event.totalScheduledHours || 0;

    // Calculate assigned hours based on operators assigned to this event
    const assignedOperators = currentOperators.filter((op: any) => 
      op.assignedEvents && Array.isArray(op.assignedEvents) && op.assignedEvents.includes(event.id)
    );

    // For now, assume each assigned operator works the full planned hours
    // This represents the "ore assegnate tramite i turni operatore"
    const assignedHours = assignedOperators.length * totalPlannedHours;

    // Calculate the total required hours based on the event's personnel requirements
    // This represents the "monte ore totale dei dipendenti previsti"
    const totalRequiredHours = event.personnelCounts ? 
      Object.values(event.personnelCounts).reduce((sum, count) => sum + count, 0) * totalPlannedHours : 
      totalPlannedHours;

    const percentage = totalRequiredHours > 0 ? Math.round((assignedHours / totalRequiredHours) * 100) : 0;

    const result = {
      assigned: assignedHours,
      total: totalRequiredHours,
      percentage
    };

    console.log(`StaffKPIBadge: Hours KPI result for event ${event.id}:`, result);
    return result;
  }, [event.id, event.totalScheduledHours, event.personnelCounts, operators, localOperators, updateTrigger, localUpdateTrigger]);
  
  // Dynamic color based on percentage
  const getKpiColorClass = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getKpiColorClass(kpi.percentage)}`}
      title={`Ore assegnate: ${kpi.assigned}h / Ore richieste: ${kpi.total}h`}
    >
      {kpi.assigned}h / {kpi.total}h ({kpi.percentage}%)
    </span>
  );
};

export default StaffKPIBadge;
