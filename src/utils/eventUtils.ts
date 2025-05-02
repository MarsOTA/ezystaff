import { format } from "date-fns";
import { EventFormData } from "@/hooks/useEventForm";
import { Event } from "@/types/event";
import { Client } from "@/pages/Clients";
import { safeLocalStorage } from "@/utils/fileUtils";
import { PlacePrediction } from "@/hooks/useEventForm";
import { EVENTS_STORAGE_KEY } from "@/utils/operatorUtils";

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: { input: string; types?: string[] },
              callback: (
                predictions: PlacePrediction[] | null,
                status: string
              ) => void
            ) => void;
          };
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
            UNKNOWN_ERROR: string;
          };
        };
      };
    };
    initGoogleMapsCallback?: () => void;
  }
}

export const getAutocompleteService = (): any | null => {
  if (window.google && window.google.maps && window.google.maps.places) {
    return new window.google.maps.places.AutocompleteService();
  }
  return null;
};

export const handleLocationSearch = (
  value: string,
  autocompleteService: any,
  setLocationSuggestions: (suggestions: PlacePrediction[]) => void,
  setShowLocationSuggestions: (show: boolean) => void
) => {
  if (value.length > 2 && autocompleteService) {
    autocompleteService.getPlacePredictions(
      {
        input: value,
        types: ['(cities)']
      },
      (predictions: PlacePrediction[] | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setLocationSuggestions(predictions);
          setShowLocationSuggestions(true);
        } else {
          setLocationSuggestions([]);
          setShowLocationSuggestions(false);
        }
      }
    );
  } else {
    setShowLocationSuggestions(false);
  }
};

export const handleAddressSearch = (
  value: string,
  autocompleteService: any,
  setAddressSuggestions: (suggestions: PlacePrediction[]) => void,
  setShowAddressSuggestions: (show: boolean) => void
) => {
  if (value.length > 2 && autocompleteService) {
    autocompleteService.getPlacePredictions(
      {
        input: value,
        types: ['address']
      },
      (predictions: PlacePrediction[] | null, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setAddressSuggestions(predictions);
          setShowAddressSuggestions(true);
        } else {
          setAddressSuggestions([]);
          setShowAddressSuggestions(false);
        }
      }
    );
  } else {
    setShowAddressSuggestions(false);
  }
};

export const combineDateTime = (date: Date | undefined, timeString: string): Date => {
  if (!date) return new Date();
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes);
  return newDate;
};

export const validateEventForm = (formData: EventFormData): string | null => {
  if (!formData.title || !formData.client || formData.selectedPersonnel.length === 0 || !formData.startDate || !formData.endDate) {
    return "Compila tutti i campi obbligatori";
  }
  
  const hasInvalidStaffCount = formData.selectedPersonnel.some(
    personnelId => !formData.staffCount[personnelId] || formData.staffCount[personnelId] <= 0
  );

  if (hasInvalidStaffCount) {
    return "Inserisci un numero valido di personale per ogni tipologia selezionata";
  }
  
  const fullStartDate = combineDateTime(formData.startDate, formData.startTime);
  const fullEndDate = combineDateTime(formData.endDate, formData.endTime);
  
  if (fullEndDate <= fullStartDate) {
    return "La data di fine deve essere successiva alla data di inizio";
  }
  
  return null;
};

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
    
    const staffCount = formData.staffCount || {};
    
    const additionalData = {
      grossHours: formData.grossHours ? Number(formData.grossHours) : undefined,
      breakStartTime: formData.breakStartTime || undefined,
      breakEndTime: formData.breakEndTime || undefined,
      netHours: formData.netHours ? Number(formData.netHours) : undefined,
      hourlyRateCost: formData.hourlyRateCost ? Number(formData.hourlyRateCost) : undefined,
      hourlyRateSell: formData.hourlyRateSell ? Number(formData.hourlyRateSell) : undefined,
      staffCount: staffCount
    };
    
    const isEditMode = !!eventId;
    
    if (isEditMode) {
      const updatedEvents = existingEvents.map(event => {
        if (event.id === Number(eventId)) {
          return {
            ...event,
            title: formData.title,
            client: selectedClient ? selectedClient.companyName : 'Cliente sconosciuto',
            startDate: fullStartDate,
            endDate: fullEndDate,
            personnelTypes: formData.selectedPersonnel,
            location: formData.eventLocation,
            address: formData.eventAddress,
            staffCount: staffCount,
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
        staffCount: staffCount,
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
