
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
} from "lucide-react";
import { Client } from "@/pages/Clients";

interface ClientInfoProps {
  client: Client;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <Building className="h-6 w-6 mr-2 text-primary" />
          <CardTitle>{client.companyName}</CardTitle>
        </div>
        <CardDescription>
          P.IVA/C.F.: {client.taxId}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Email</h4>
                <p>{client.email}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Telefono</h4>
                <p>{client.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Indirizzo</h4>
                <p>
                  {client.address && `${client.address}, `}
                  {client.zipCode && `${client.zipCode} `}
                  {client.city && `${client.city} `}
                  {client.province && `(${client.province})`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <User className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-medium">Persona di contatto</h4>
                <p>
                  {client.contactPerson || "Non specificato"}
                  {client.contactRole && ` - ${client.contactRole}`}
                </p>
              </div>
            </div>
            
            {client.notes && (
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">Note</h4>
                  <p className="whitespace-pre-line">{client.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientInfo;
