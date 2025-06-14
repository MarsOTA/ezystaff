
import { useState, useEffect } from 'react';
import { OPERATORS_STORAGE_KEY } from '@/types/operator';
import { safeLocalStorage } from "@/utils/fileUtils";

export const useOperatorData = () => {
  const [operators, setOperators] = useState<any[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Load operators from localStorage
  const loadOperators = () => {
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
  };

  // Force reload
  const forceReload = () => {
    console.log("OperatorData: Forcing reload of operators");
    loadOperators();
    setUpdateTrigger(prev => prev + 1);
  };

  // Initial load
  useEffect(() => {
    loadOperators();
  }, []);

  // Listen for various events that should trigger a reload
  useEffect(() => {
    const handleOperatorAssignment = () => {
      console.log("OperatorData: Operator assignment detected, reloading");
      setTimeout(forceReload, 100); // Small delay to ensure localStorage is written
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OPERATORS_STORAGE_KEY) {
        console.log("OperatorData: Storage change detected, reloading");
        forceReload();
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

    // Add all event listeners
    window.addEventListener('operatorAssigned', handleOperatorAssignment);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also check for updates periodically
    const interval = setInterval(() => {
      const currentOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (currentOperators) {
        try {
          const parsed = JSON.parse(currentOperators);
          const currentString = JSON.stringify(operators);
          const newString = JSON.stringify(parsed);
          if (currentString !== newString) {
            console.log("OperatorData: Operators changed, updating");
            setOperators(parsed);
            setUpdateTrigger(prev => prev + 1);
          }
        } catch (error) {
          console.error("Error checking operators:", error);
        }
      }
    }, 2000); // Check every 2 seconds

    return () => {
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [operators]);

  return { operators, updateTrigger };
};
