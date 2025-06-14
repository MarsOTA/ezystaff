
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
        setUpdateTrigger(prev => prev + 1);
        return parsedOperators;
      } catch (error) {
        console.error("Error parsing operators:", error);
        setOperators([]);
        setUpdateTrigger(prev => prev + 1);
        return [];
      }
    }
    setOperators([]);
    setUpdateTrigger(prev => prev + 1);
    return [];
  }, []);

  // Force reload and trigger update
  const forceReload = useCallback(() => {
    console.log("OperatorData: Forcing reload of operators");
    loadOperators();
  }, [loadOperators]);

  // Initial load
  useEffect(() => {
    loadOperators();
  }, [loadOperators]);

  // Listen for operator assignment events and storage changes
  useEffect(() => {
    const handleOperatorAssignment = () => {
      console.log("OperatorData: Operator assignment event detected");
      // Piccolo ritardo per assicurarsi che il localStorage sia stato aggiornato
      setTimeout(() => {
        forceReload();
      }, 100);
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === OPERATORS_STORAGE_KEY) {
        console.log("OperatorData: Storage change detected for operators");
        forceReload();
      }
    };

    // Polling periodico per catturare modifiche che potrebbero sfuggire agli eventi
    const pollInterval = setInterval(() => {
      const currentOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
      if (currentOperators) {
        try {
          const parsed = JSON.parse(currentOperators);
          const currentString = JSON.stringify(operators);
          const newString = JSON.stringify(parsed);
          
          if (currentString !== newString) {
            console.log("OperatorData: Polling detected changes");
            setOperators(parsed);
            setUpdateTrigger(prev => prev + 1);
          }
        } catch (error) {
          console.error("Error in polling:", error);
        }
      }
    }, 2000); // Poll ogni 2 secondi

    window.addEventListener('operatorAssigned', handleOperatorAssignment);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('operatorAssigned', handleOperatorAssignment);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(pollInterval);
    };
  }, [forceReload, operators]);

  return { operators, updateTrigger, forceReload };
};
