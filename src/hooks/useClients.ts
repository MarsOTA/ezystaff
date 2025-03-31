import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { safeLocalStorage } from "@/utils/fileUtils";
import { Client } from "@/pages/Clients";
import { CLIENTS_STORAGE_KEY, EVENTS_STORAGE_KEY } from "@/utils/client";

export const useClients = () => {
  const navigate = useNavigate();
  
  // State for clients and search
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientsWithEvents, setClientsWithEvents] = useState<{id: number, eventCount: number}[]>([]);
  
  // Load clients from localStorage on component mount
  useEffect(() => {
    loadClients();
  }, []);
  
  // Load event counts when clients change
  useEffect(() => {
    if (clients.length > 0) {
      loadEventCounts();
    }
  }, [clients]);
  
  // Load clients from localStorage
  const loadClients = () => {
    const storedClients = safeLocalStorage.getItem(CLIENTS_STORAGE_KEY);
    
    if (storedClients) {
      try {
        const parsedClients = JSON.parse(storedClients);
        setClients(parsedClients);
      } catch (error) {
        console.error("Errore nel caricamento dei clienti:", error);
        
        // Default clients as fallback
        const defaultClients = [
          {
            id: 1,
            companyName: "EventiTop Srl",
            taxId: "IT12345678901",
            email: "info@eventitop.it",
            phone: "+39 02 1234567",
            address: "Via Roma 123",
            city: "Milano",
            zipCode: "20100",
            province: "MI",
            contactPerson: "Mario Rossi",
            contactRole: "Direttore Eventi",
          },
          {
            id: 2,
            companyName: "Congressi Italia SpA",
            taxId: "IT98765432109",
            email: "contatti@congressiitalia.com",
            phone: "+39 06 9876543",
            address: "Viale Europa 45",
            city: "Roma",
            zipCode: "00144",
            province: "RM",
            contactPerson: "Giulia Bianchi",
            contactRole: "Responsabile Vendite",
          },
        ];
        
        setClients(defaultClients);
        safeLocalStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(defaultClients));
      }
    } else {
      // No clients in localStorage, use default data
      const defaultClients = [
        {
          id: 1,
          companyName: "EventiTop Srl",
          taxId: "IT12345678901",
          email: "info@eventitop.it",
          phone: "+39 02 1234567",
          address: "Via Roma 123",
          city: "Milano",
          zipCode: "20100",
          province: "MI",
          contactPerson: "Mario Rossi",
          contactRole: "Direttore Eventi",
        },
        {
          id: 2,
          companyName: "Congressi Italia SpA",
          taxId: "IT98765432109",
          email: "contatti@congressiitalia.com",
          phone: "+39 06 9876543",
          address: "Viale Europa 45",
          city: "Roma",
          zipCode: "00144",
          province: "RM",
          contactPerson: "Giulia Bianchi",
          contactRole: "Responsabile Vendite",
        },
      ];
      
      setClients(defaultClients);
      safeLocalStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(defaultClients));
    }
  };
  
  // Load event counts for clients
  const loadEventCounts = () => {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (storedEvents) {
      try {
        const events = JSON.parse(storedEvents);
        
        // Calculate event count per client
        const clientEventCounts = clients.map(client => {
          const count = events.filter((event: any) => event.client === client.companyName).length;
          return { id: client.id, eventCount: count };
        });
        
        setClientsWithEvents(clientEventCounts);
      } catch (error) {
        console.error("Errore nel calcolo degli eventi per cliente:", error);
        // In case of error, initialize with zero counts
        const emptyCount = clients.map(client => ({ id: client.id, eventCount: 0 }));
        setClientsWithEvents(emptyCount);
      }
    } else {
      // No events found, initialize with zero counts
      const emptyCount = clients.map(client => ({ id: client.id, eventCount: 0 }));
      setClientsWithEvents(emptyCount);
    }
  };
  
  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to create a new client
  const handleCreateClient = () => {
    navigate("/client-create");
  };
  
  // Function to edit a client
  const handleEditClient = (e: React.MouseEvent, clientId: number) => {
    e.stopPropagation();
    navigate(`/client-create?id=${clientId}`);
  };
  
  // Function to view client details
  const handleViewClient = (clientId: number) => {
    navigate(`/client-detail/${clientId}`);
  };
  
  // Function to delete a client
  const handleDeleteClient = (e: React.MouseEvent, clientId: number) => {
    e.stopPropagation();
    
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    
    safeLocalStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
    
    toast.success("Cliente eliminato con successo");
  };

  return {
    clients: filteredClients,
    clientsWithEvents,
    searchTerm,
    setSearchTerm,
    handleCreateClient,
    handleEditClient,
    handleViewClient,
    handleDeleteClient
  };
};
