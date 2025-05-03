
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import React, { useEffect } from "react";

interface OperatorRouteProps {
  component: React.ComponentType;
}

const OperatorRoute: React.FC<OperatorRouteProps> = ({ component: Component }) => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("OperatorRoute - User authenticated:", user);
    } else {
      console.log("OperatorRoute - User not authenticated");
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    console.log("OperatorRoute - Redirecting to login (not authenticated)");
    return <Navigate to="/login" replace />;
  }

  // Allow both "operator" role and undefined role (for backward compatibility)
  // This temporary fix ensures existing operators can still access their pages
  if (user?.role !== "operator" && user?.role !== undefined) {
    console.log("OperatorRoute - Redirecting to dashboard (not operator role):", user?.role);
    return <Navigate to="/dashboard" replace />;
  }

  return <Component />;
};

export default OperatorRoute;
