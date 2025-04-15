
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import React from "react";

interface OperatorRouteProps {
  component: React.ComponentType;
}

const OperatorRoute: React.FC<OperatorRouteProps> = ({ component: Component }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "operator") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Component />;
};

export default OperatorRoute;
