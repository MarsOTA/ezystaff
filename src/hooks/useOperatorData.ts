
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
      forceReload();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('operatorAssigned', handleOperatorAssignment);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
    };
  }, [forceReload]);

  return { 
    operators, 
    setOperators: saveOperators, 
    updateTrigger, 
    forceReload,
    updateOperators 
  };
};
