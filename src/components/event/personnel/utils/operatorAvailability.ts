
import { Operator } from "@/types/operator";
import { safeLocalStorage } from "@/utils/fileUtils";
import { EVENTS_STORAGE_KEY } from "@/types/event";
import { AvailabilityStatus } from "../availability/AvailabilityBadge";

export const getConflictingEvents = (operator: Operator, eventId: string | null): string[] => {
  if (!eventId || !operator.assignedEvents || operator.assignedEvents.length === 0) {
    return [];
  }
  
  try {
    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) return [];
    
    const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
    if (!storedEvents) return [];
    
    const events = JSON.parse(storedEvents);
    const currentEvent = events.find((e: any) => e.id === eventIdNum);
    if (!currentEvent) return [];
    
    const currentStart = new Date(currentEvent.startDate);
    const currentEnd = new Date(currentEvent.endDate);
    
    // Find conflicting events based on time overlap
    return events
      .filter((e: any) => {
        if (e.id === eventIdNum) return false;
        if (!operator.assignedEvents?.includes(e.id)) return false;
        
        const eventStart = new Date(e.startDate);
        const eventEnd = new Date(e.endDate);
        
        // Check for time overlap
        return (currentStart <= eventEnd && eventStart <= currentEnd);
      })
      .map((e: any) => e.title);
  } catch (error) {
    console.error("Error finding conflicting events:", error);
    return [];
  }
};

export const checkAvailability = (operator: Operator, eventId: string | null): AvailabilityStatus => {
  if (!eventId) return 'yes';
  
  try {
    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) return 'yes';
    
    // If already assigned to this event, they're at least partially available
    if (operator.assignedEvents?.includes(eventIdNum)) {
      return 'partial';
    }
    
    // Check for conflicting events
    const conflicts = getConflictingEvents(operator, eventId);
    if (conflicts.length > 0) {
      return 'no';
    }
    
    // If assigned to other events but no conflicts, consider them partially available
    return operator.assignedEvents && operator.assignedEvents.length > 0 ? 'partial' : 'yes';
  } catch (error) {
    console.error("Error checking availability:", error);
    return 'yes';
  }
};
