
import { safeLocalStorage } from "@/utils/fileUtils";
import { Client } from "@/pages/Clients";
import { Event } from "@/pages/Events";
import { toast } from "sonner";

// Constants
export const CLIENTS_STORAGE_KEY = "app_clients_data";
export const EVENTS_STORAGE_KEY = "app_events_data";

// Load client by ID
export const loadClientById = (id: string | undefined, navigate: (path: string) => void) => {
  try {
    const storedClients = safeLocalStorage.getItem(CLIENTS_STORAGE_KEY);
    if (!storedClients) {
      toast.error("Nessun cliente trovato");
      navigate("/clients");
      return null;
    }
    
    const clients = JSON.parse(storedClients);
    const foundClient = clients.find((c: Client) => c.id.toString() === id);
    
    if (!foundClient) {
      toast.error("Cliente non trovato");
      navigate("/clients");
      return null;
    }
    
    return foundClient;
  } catch (error) {
    console.error("Errore nel caricamento del cliente:", error);
    toast.error("Errore nel caricamento dei dati del cliente");
    navigate("/clients");
    return null;
  }
};

// Load events for client
export const loadClientEvents = (client: Client | null) => {
  if (!client) return [];
  
  try {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (!storedEvents) return [];
    
    const events = JSON.parse(storedEvents);
    
    // Converti le stringhe di date in oggetti Date
    const parsedEvents = events.map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }));
    
    // Filtra gli eventi per il cliente corrente
    return parsedEvents.filter(
      (event: Event) => event.client === client.companyName
    );
  } catch (error) {
    console.error("Errore nel caricamento degli eventi:", error);
    return [];
  }
};
