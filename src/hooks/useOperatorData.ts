
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

  // Save operators to localStorage and trigger update
  const saveOperators = useCallback((newOperators: any[]) => {
    console.log("OperatorData: Saving operators:", newOperators);
    safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(newOperators));
    setOperators(newOperators);
    setUpdateTrigger(prev => prev + 1);
    
    // Dispatch events to notify other components
    window.dispatchEvent(new CustomEvent('operatorAssigned'));
    window.dispatchEvent(new CustomEvent('operatorDataUpdated', { detail: newOperators }));
    window.dispatchEvent(new StorageEvent('storage', {
      key: OPERATORS_STORAGE_KEY,
      newValue: JSON.stringify(newOperators)
    }));
  }, []);

  // Update operators function that properly saves data
  const updateOperators = useCallback((updaterFn: (operators: any[]) => any[]) => {
    const current = loadOperators();
    const updated = updaterFn(current);
    saveOperators(updated);
  }, [loadOperators, saveOperators]);

  // Force reload and trigger update
  const forceReload = useCallback(() => {
    console.log("OperatorData: Forcing reload of operators");
    const loaded = loadOperators();
    setUpdateTrigger(prev => prev + 1);
    return loaded;
  }, [loadOperators]);

  // Aggressive refresh function
  const aggressiveRefresh = useCallback(() => {
    console.log("OperatorData: Aggressive refresh");
    setTimeout(() => {
      forceReload();
    }, 100);
    setTimeout(() => {
      forceReload();
    }, 500);
    setTimeout(() => {
      forceReload();
    }, 1000);
  }, [forceReload]);

  // Initial load
  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  // Listen for storage changes and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OPERATORS_STORAGE_KEY) {
        console.log("OperatorData: Storage change detected");
        forceReload();
      }
    };

    const handleOperatorAssignment = () => {
      console.log("OperatorData: Operator assignment event detected");
      aggressiveRefresh();
    };

    const handleOperatorDataUpdated = () => {
      console.log("OperatorData: Operator data updated event detected");
      forceReload();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('operatorAssigned', handleOperatorAssignment);
    window.addEventListener('operatorDataUpdated', handleOperatorDataUpdated);

    // Periodic check every 2 seconds
    const interval = setInterval(() => {
      const current = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (current) {
        try {
          const parsed = JSON.parse(current);
          if (JSON.stringify(parsed) !== JSON.stringify(operators)) {
            console.log("OperatorData: Periodic check detected changes");
            forceReload();
          }
        } catch (error) {
          console.error("Error in periodic check:", error);
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
      window.removeEventListener('operatorDataUpdated', handleOperatorDataUpdated);
      clearInterval(interval);
    };
  }, [forceReload, aggressiveRefresh, operators]);

  return { 
    operators, 
    setOperators: saveOperators, 
    updateTrigger, 
    forceReload,
    updateOperators,
    aggressiveRefresh
  };
};
