
import { safeLocalStorage } from "@/utils/fileUtils";
import { Client } from "@/pages/Clients";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";

// Load events for client
export const loadClientEvents = (client: Client | null) => {
  if (!client) return [];
  
  try {
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (!storedEvents) return [];
    
    const events = JSON.parse(storedEvents);
    
    // Convert date strings to Date objects
    const parsedEvents = events.map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }));
    
    // Filter events for the current client
    return parsedEvents.filter(
      (event: Event) => event.client === client.companyName
    );
  } catch (error) {
    console.error("Error loading client events:", error);
    return [];
  }
};
