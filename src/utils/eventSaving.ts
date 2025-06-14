
import { EventFormData } from "@/types/eventForm";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { Client } from "@/pages/Clients";
import { safeLocalStorage } from "@/utils/fileUtils";
import { combineDateTime } from "./eventValidation";

export const saveEvent = (formData: EventFormData, eventId: string | null, clients: Client[]): { success: boolean, message: string } => {
  try {
    const existingEventsJson = safeLocalStorage.getItem(EVENTS_STORAGE_KEY) || "[]";
    const existingEvents: Event[] = JSON.parse(existingEventsJson).map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }));
    
    const selectedClient = clients.find(c => c.id.toString() === formData.client);
    
    const fullStartDate = combineDateTime(formData.startDate, formData.startTime);
    const fullEndDate = combineDateTime(formData.endDate, formData.endTime);
    
    const additionalData = {
      grossHours: formData.grossHours ? Number(formData.grossHours) : undefined,
      breakStartTime: formData.breakStartTime || undefined,
      breakEndTime: formData.breakEndTime || undefined,
      netHours: formData.netHours ? Number(formData.netHours) : undefined,
      hourlyRateCost: formData.hourlyRateCost ? Number(formData.hourlyRateCost) : undefined,
      hourlyRateSell: formData.hourlyRateSell ? Number(formData.hourlyRateSell) : undefined,
      personnelCounts: formData.personnelCounts || {}
    };
    
    const isEditMode = !!eventId;
    
    if (isEditMode) {
      const eventIdNum = parseInt(eventId as string);
      if (isNaN(eventIdNum)) {
        return { success: false, message: "ID evento non valido" };
      }
      
      const updatedEvents = existingEvents.map(event => {
        if (event.id === eventIdNum) {
          return {
            ...event,
            title: formData.title,
            client: selectedClient ? selectedClient.companyName : 'Cliente sconosciuto',
            startDate: fullStartDate,
            endDate: fullEndDate,
            personnelTypes: formData.selectedPersonnel,
            location: formData.eventLocation,
            address: formData.eventAddress,
            ...additionalData
          };
        }
        return event;
      });
      
      safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      return { success: true, message: "Evento aggiornato con successo!" };
    } else {
      const maxId = existingEvents.reduce((max, event) => Math.max(max, event.id), 0);
      
      const newEvent: Event = {
        id: maxId + 1,
        title: formData.title,
        client: selectedClient ? selectedClient.companyName : 'Cliente sconosciuto',
        startDate: fullStartDate,
        endDate: fullEndDate,
        personnelTypes: formData.selectedPersonnel,
        location: formData.eventLocation,
        address: formData.eventAddress,
        ...additionalData
      };
      
      const updatedEvents = [...existingEvents, newEvent];
      safeLocalStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      
      return { success: true, message: "Evento creato con successo!" };
    }
  } catch (error) {
    console.error("Errore durante il salvataggio dell'evento:", error);
    return { success: false, message: "Errore durante il salvataggio dell'evento" };
  }
};
