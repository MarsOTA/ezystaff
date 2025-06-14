
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Briefcase, Building2, LogOut, Clock, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { to: "/operators", icon: Users, label: "Operatori" },
    { to: "/clients", icon: Building2, label: "Clienti" },
    { to: "/events", icon: Calendar, label: "Eventi" },
    { to: "/calendar", icon: Calendar, label: "Calendario" },
    { to: "/attendances", icon: Clock, label: "Presenze" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold">
              EzyStaff
            </Link>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-4">
              {menuItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button variant="outline">
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
            <div className="md:hidden">
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
                    <Button variant="outline" className="w-full justify-start">
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

export default Layout;
