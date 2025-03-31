
import { safeLocalStorage } from "@/utils/fileUtils";
import { Client } from "@/pages/Clients";
import { toast } from "sonner";

// Constants
export const CLIENTS_STORAGE_KEY = "app_clients_data";

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
