
import { safeLocalStorage } from "@/utils/fileUtils";

export const OPERATORS_STORAGE_KEY = "app_operators_data";

/**
 * Retrieves operators from localStorage
 * @returns Array of operators or empty array if none found
 */
export const getOperators = () => {
  const storedOperators = safeLocalStorage.getItem(OPERATORS_STORAGE_KEY);
  if (!storedOperators) {
    return [];
  }
  
  try {
    return JSON.parse(storedOperators);
  } catch (error) {
    console.error("Error parsing operators data:", error);
    return [];
  }
};

/**
 * Saves operators to localStorage
 * @param operators Array of operators to save
 */
export const saveOperators = (operators: any[]) => {
  safeLocalStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
};

/**
 * Clears all event assignments from operators
 * @returns True if successful, false otherwise
 */
export const clearAllOperatorEventAssignments = () => {
  try {
    const operators = getOperators();
    
    if (operators.length === 0) {
      return false;
    }
    
    const clearedOperators = operators.map(operator => ({
      ...operator,
      assignedEvents: []
    }));
    
    saveOperators(clearedOperators);
    return true;
  } catch (error) {
    console.error("Error clearing operator event assignments:", error);
    return false;
  }
};
