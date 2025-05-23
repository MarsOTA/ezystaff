
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { safeLocalStorage } from "@/utils/fileUtils";

interface User {
  email: string;
  name: string;
  role: "admin" | "operator";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
        const userData = { email, name: "Admin User", role: "admin" as const };
        setUser(userData);
        if (remember) {
          safeLocalStorage.setItem("user", JSON.stringify(userData));
        }
        toast.success("Login effettuato con successo");
        navigate("/dashboard");
        return;
      } 
      
      // Mock operator login
      if (email.endsWith("@operator.com") && password === "operator") {
        const name = email.split("@")[0];
        const userData = { email, name: `${name.charAt(0).toUpperCase()}${name.slice(1)}`, role: "operator" as const };
        setUser(userData);
        if (remember) {
          safeLocalStorage.setItem("user", JSON.stringify(userData));
        }
        toast.success("Login effettuato con successo");
        navigate("/operator/tasks");
        return;
      }
      
      throw new Error("Credenziali non valide");
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
