
import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Client } from "@/pages/Clients";

interface ClientsTableProps {
  clients: Client[];
  eventCounts: {id: number, eventCount: number}[];
  onViewClient: (clientId: number) => void;
  onEditClient: (e: React.MouseEvent, clientId: number) => void;
  onDeleteClient: (e: React.MouseEvent, clientId: number) => void;
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  eventCounts,
  onViewClient,
  onEditClient,
  onDeleteClient,
}) => {
  // Helper function to get event count for a client
  const getEventCount = (clientId: number) => {
    const client = eventCounts.find(c => c.id === clientId);
    return client ? client.eventCount : 0;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ragione Sociale</TableHead>
          <TableHead>P.IVA/C.F.</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefono</TableHead>
          <TableHead>Numero Eventi</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow 
            key={client.id} 
            className="cursor-pointer hover:bg-muted/50" 
            onClick={() => onViewClient(client.id)}
          >
            <TableCell className="font-medium">{client.companyName}</TableCell>
            <TableCell>{client.taxId}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.phone}</TableCell>
            <TableCell>{getEventCount(client.id)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => onEditClient(e, client.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600" 
                  onClick={(e) => onDeleteClient(e, client.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClientsTable;
