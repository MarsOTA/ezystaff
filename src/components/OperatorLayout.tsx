import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Briefcase, User, ListChecks, CalendarDays } from "lucide-react";

const OperatorLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold">
            Security Operator
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-muted-foreground mr-2">
              {user?.name}
            </span>
            <Link to="/operator/tasks">
              <Button 
                variant={location.pathname === "/operator/tasks" ? "default" : "outline"}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Task oggi
              </Button>
            </Link>
            <Link to="/operator/future-assignments">
              <Button
                variant={location.pathname === "/operator/future-assignments" ? "default" : "outline"}
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Incarichi futuri
              </Button>
            </Link>
            <Link to="/operator/all-assignments">
              <Button
                variant={location.pathname === "/operator/all-assignments" ? "default" : "outline"}
              >
                <ListChecks className="mr-2 h-4 w-4" />
                Tutti gli incarichi
              </Button>
            </Link>
            <Link to="/operator/profile">
              <Button 
                variant={location.pathname === "/operator/profile" ? "default" : "outline"}
              >
                <User className="mr-2 h-4 w-4" />
                Profilo
              </Button>
            </Link>
            <Button variant="outline" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default OperatorLayout;
