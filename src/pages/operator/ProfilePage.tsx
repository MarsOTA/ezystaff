
import React from "react";
import OperatorLayout from "@/components/OperatorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  
  // This would typically come from a database
  const mockProfileData = {
    fullName: user?.name || "",
    email: user?.email || "",
    role: "Security Guard",
    phone: "+39 123 456 7890",
    address: "Via Roma 123, Milano",
    employeeId: "SEC-" + Math.floor(1000 + Math.random() * 9000)
  };
  
  return (
    <OperatorLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Il mio profilo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-center">Profilo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mockProfileData.fullName)}`} />
                <AvatarFallback>{mockProfileData.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{mockProfileData.fullName}</h2>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {mockProfileData.role}
              </span>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Informazioni personali</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nome completo</h3>
                  <p>{mockProfileData.fullName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p>{mockProfileData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telefono</h3>
                  <p>{mockProfileData.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ID Dipendente</h3>
                  <p>{mockProfileData.employeeId}</p>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Indirizzo</h3>
                  <p>{mockProfileData.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </OperatorLayout>
  );
};

export default ProfilePage;
