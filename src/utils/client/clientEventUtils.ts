
import { safeLocalStorage } from "@/utils/fileUtils";
import { Client } from "@/pages/Clients";
import { Event } from "@/types/event";

// Constants
export const EVENTS_STORAGE_KEY = "app_events_data";

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
