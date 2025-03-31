
// Utility functions for file handling

// Convert a file to base64 URL
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// In-memory storage fallback when localStorage is unavailable
const memoryStorage: Record<string, string> = {};

// Helper function to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Helper function to safely access localStorage with fallback to memory storage
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(key);
      } else {
        console.info("Using in-memory storage fallback (localStorage unavailable)");
        return memoryStorage[key] || null;
      }
    } catch (error) {
      console.error("Failed to read from storage:", error);
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(key, value);
      } else {
        console.info("Using in-memory storage fallback (localStorage unavailable)");
        memoryStorage[key] = value;
      }
    } catch (error) {
      console.error("Failed to write to storage:", error);
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(key);
      } else {
        console.info("Using in-memory storage fallback (localStorage unavailable)");
        delete memoryStorage[key];
      }
    } catch (error) {
      console.error("Failed to remove from storage:", error);
      delete memoryStorage[key];
    }
  }
};

