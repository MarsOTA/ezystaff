
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Briefcase, User, ListChecks, CalendarDays, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const OperatorLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { to: "/operator/tasks", icon: Briefcase, label: "Task oggi" },
    { to: "/operator/future-assignments", icon: CalendarDays, label: "Incarichi futuri" },
    { to: "/operator/all-assignments", icon: ListChecks, label: "Tutti gli incarichi" },
    { to: "/operator/profile", icon: User, label: "Profilo" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              Security Operator
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-4 items-center">
              <span className="text-sm text-muted-foreground mr-2">
                {user?.name}
              </span>
              {menuItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button 
                    variant={location.pathname === item.to ? "default" : "outline"}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Button variant="outline" size="icon" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col gap-2">
                {menuItems.map((item) => (
                  <Link key={item.to} to={item.to} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant={location.pathname === item.to ? "default" : "outline"}
                      className="w-full justify-start"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Button variant="outline" onClick={logout} className="w-full justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};

export default OperatorLayout;
