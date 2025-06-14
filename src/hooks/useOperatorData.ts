
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
    loadOperators();
    setUpdateTrigger(prev => prev + 1);
  }, [loadOperators]);

  // Initial load
  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  // Listen for operator assignment events
  useEffect(() => {
    const handleOperatorAssignment = () => {
      console.log("OperatorData: Operator assignment event detected");
      forceReload();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OPERATORS_STORAGE_KEY) {
        console.log("OperatorData: Storage change detected for operators");
        forceReload();
      }
    };

    window.addEventListener('operatorAssigned', handleOperatorAssignment);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [forceReload]);

  return { operators, updateTrigger, forceReload };
};
