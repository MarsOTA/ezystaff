
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ClientsTable from "@/components/client/ClientsTable";
import EmptyClientState from "@/components/client/EmptyClientState";
import ClientSearch from "@/components/client/ClientSearch";
import { useClients } from "@/hooks/useClients";

// Definizione dell'interfaccia Client
export interface Client {
  id: number;
  companyName: string;
  taxId: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  province?: string;
  contactPerson?: string;
  contactRole?: string;
  notes?: string;
}

const Clients = () => {
  const {
    clients: filteredClients,
    clientsWithEvents,
    searchTerm,
    setSearchTerm,
    handleCreateClient,
    handleEditClient,
    handleViewClient,
    handleDeleteClient
  } = useClients();

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Clienti</CardTitle>
          <Button onClick={handleCreateClient}>
            <Plus className="mr-2 h-4 w-4" />
            Crea nuovo cliente
          </Button>
        </CardHeader>
        <CardContent>
          <ClientSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          
          {filteredClients.length > 0 ? (
            <ClientsTable
              clients={filteredClients}
              eventCounts={clientsWithEvents}
              onViewClient={handleViewClient}
              onEditClient={handleEditClient}
              onDeleteClient={handleDeleteClient}
            />
          ) : (
            <EmptyClientState
              searchTerm={searchTerm}
              onCreateClient={handleCreateClient}
            />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Clients;
