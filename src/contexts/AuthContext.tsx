
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Failed to read from localStorage:", error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Failed to write to localStorage:", error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = safeLocalStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
  }, []);

  const login = async (email: string, password: string, remember: boolean) => {
    try {
      // Mock login - replace with actual authentication
      if (email === "admin@example.com" && password === "password") {
        const userData = { email, name: "Admin User" };
        setUser(userData);
        if (remember) {
          safeLocalStorage.setItem("user", JSON.stringify(userData));
        }
        toast.success("Login effettuato con successo");
        navigate("/dashboard");
      } else {
        throw new Error("Credenziali non valide");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Errore durante il login");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    safeLocalStorage.removeItem("user");
    navigate("/login");
    toast.success("Logout effettuato con successo");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
