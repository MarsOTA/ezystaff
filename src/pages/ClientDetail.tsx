
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit } from "lucide-react";
import { Client } from "./Clients";
import { Event } from "./Events";
import ClientInfo from "@/components/client/ClientInfo";
import ClientEvents from "@/components/client/ClientEvents";
import { loadClientById, loadClientEvents } from "@/utils/client";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [clientEvents, setClientEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carica i dati del cliente
  useEffect(() => {
    const loadData = () => {
      const foundClient = loadClientById(id, navigate);
      if (foundClient) {
        setClient(foundClient);
        const events = loadClientEvents(foundClient);
        setClientEvents(events);
      }
      setLoading(false);
    };
    
    loadData();
  }, [id, navigate]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Caricamento...</div>
        </div>
      </Layout>
    );
  }
  
  if (!client) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Cliente non trovato</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/clients")}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Torna alla lista
          </Button>
          <Button 
            onClick={() => navigate(`/client-create?id=${client.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifica
          </Button>
        </div>
        
        <ClientInfo client={client} />
        
        <Card>
          <CardContent className="pt-6">
            <ClientEvents 
              clientEvents={clientEvents} 
              clientCompanyName={client.companyName} 
            />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientDetail;
