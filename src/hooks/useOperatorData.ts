
import { useState, useEffect, useCallback } from 'react';
import { OPERATORS_STORAGE_KEY } from '@/types/operator';
import { safeLocalStorage } from "@/utils/fileUtils";

export const useOperatorData = () => {
  const [operators, setOperators] = useState<any[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Load operators from localStorage
  const loadOperators = useCallback(() => {
    const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      try {
        const parsedOperators = JSON.parse(storedOperators);
        console.log("OperatorData: Operators loaded:", parsedOperators);
        setOperators(parsedOperators);
        return parsedOperators;
      } catch (error) {
        console.error("Error parsing operators:", error);
        setOperators([]);
        return [];
      }
    }
    setOperators([]);
    return [];
  }, []);

  // Force reload and trigger update
  const forceReload = useCallback(() => {
    console.log("OperatorData: Forcing reload of operators");
    const newOperators = loadOperators();
    setUpdateTrigger(prev => {
      const newTrigger = prev + 1;
      console.log("OperatorData: Update trigger incremented to:", newTrigger);
      return newTrigger;
    });
    return newOperators;
  }, [loadOperators]);

  // Initial load
  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  // Listen for various events that should trigger a reload
  useEffect(() => {
    const handleOperatorAssignment = (e: any) => {
      console.log("OperatorData: Operator assignment event detected:", e.detail);
      // Force immediate reload
      setTimeout(() => {
        forceReload();
      }, 10);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OPERATORS_STORAGE_KEY) {
        console.log("OperatorData: Storage change detected for operators");
        setTimeout(() => {
          forceReload();
        }, 10);
      }
    };

    const handleFocus = () => {
      console.log("OperatorData: Window focus detected, reloading");
      forceReload();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("OperatorData: Page became visible, reloading");
        forceReload();
      }
    };

    // Add custom event listener for immediate KPI updates
    const handleKPIUpdate = () => {
      console.log("OperatorData: KPI update event detected, forcing reload");
      forceReload();
    };

    // Add all event listeners
    window.addEventListener('operatorAssigned', handleOperatorAssignment);
    window.addEventListener('kpiUpdate', handleKPIUpdate);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Polling più frequente per catturare cambiamenti
    const interval = setInterval(() => {
      const currentOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (currentOperators) {
        try {
          const parsed = JSON.parse(currentOperators);
          const currentString = JSON.stringify(operators);
          const newString = JSON.stringify(parsed);
          if (currentString !== newString) {
            console.log("OperatorData: Operators changed via polling, updating");
            setOperators(parsed);
            setUpdateTrigger(prev => prev + 1);
          }
        } catch (error) {
          console.error("Error checking operators:", error);
        }
      }
    }, 500); // Check ogni 500ms per essere più reattivo

    return () => {
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
      window.removeEventListener('kpiUpdate', handleKPIUpdate);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [operators, forceReload]);

  return { operators, updateTrigger, forceReload };
};
