
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, User } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8">Security Management System</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-6 w-6 text-primary" />
                Admin Login
              </CardTitle>
              <CardDescription>
                Accedi come amministratore per gestire eventi, clienti e operatori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Username: admin@example.com <br />
                Password: password
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => navigate("/login")}
              >
                Login come Admin
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="mr-2 h-6 w-6 text-primary" />
                Operatore Login
              </CardTitle>
              <CardDescription>
                Accedi come operatore di sicurezza per gestire le tue attività
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Username: [nome]@operator.com <br />
                Password: operator <br />
                Esempio: mario@operator.com
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/login")}
              >
                Login come Operatore
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
