
import { useState, useEffect } from "react";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { Client } from "@/pages/Clients";
import { safeLocalStorage } from "@/utils/fileUtils";

export const CLIENTS_STORAGE_KEY = "app_clients_data";

export interface PlacePrediction {
  description: string;
  place_id: string;
}

export type PersonnelType = "security" | "doorman" | "hostess";

export const personnelTypes = [
  { id: "security", label: "Security" },
  { id: "doorman", label: "Doorman" },
  { id: "hostess", label: "Hostess/Steward" },
];

export interface EventFormData {
  title: string;
  client: string;
  selectedPersonnel: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  eventLocation: string;
  eventAddress: string;
  grossHours: string;
  breakStartTime: string;
  breakEndTime: string;
  netHours: string;
  hourlyRateCost: string;
  hourlyRateSell: string;
  personnelCounts?: Record<string, number>;
}

// Helper function to calculate gross hours based on dates and times
const calculateGrossHours = (
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string,
  endTime: string
): number => {
  if (!startDate || !endDate) return 0;
  
  try {
    // Parse start time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startDateTime = new Date(startDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    
    // Parse end time
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    
    // Calculate difference in milliseconds and convert to hours
    const diffMs = endDateTime.getTime() - startDateTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return Math.max(0, diffHours);
  } catch (error) {
    console.error("Error calculating gross hours:", error);
    return 0;
  }
};

export function useEventForm(eventId: string | null) {
  const isEditMode = !!eventId;
  
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    client: "",
    selectedPersonnel: [],
    startDate: new Date(),
    endDate: new Date(),
    startTime: "09:00",
    endTime: "18:00",
    eventLocation: "",
    eventAddress: "",
    grossHours: "",
    breakStartTime: "13:00",
    breakEndTime: "14:00",
    netHours: "",
    hourlyRateCost: "",
    hourlyRateSell: "",
    personnelCounts: {}
  });
  
  const [clients, setClients] = useState<Client[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<PlacePrediction[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  // Load clients
  useEffect(() => {
    const storedClients = safeLocalStorage.getItem(CLIENTS_STORAGE_KEY);
    if (storedClients) {
      try {
        const parsedClients = JSON.parse(storedClients);
        setClients(parsedClients);
      } catch (error) {
        console.error("Errore nel caricamento dei clienti:", error);
        setClients([]);
      }
    } else {
      setClients([]);
    }
  }, []);
  
  // Load event data in edit mode
  useEffect(() => {
    if (isEditMode) {
      try {
        const storedEvents = safeLocalStorage.getItem(EVENTS_STORAGE_KEY);
        if (storedEvents) {
          const events: Event[] = JSON.parse(storedEvents).map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate)
          }));
          
          const eventToEdit = events.find(e => e.id === Number(eventId));
          
          if (eventToEdit) {
            const clientObject = clients.find(c => c.companyName === eventToEdit.client);
            
            setFormData({
              title: eventToEdit.title,
              client: clientObject ? clientObject.id.toString() : "",
              selectedPersonnel: eventToEdit.personnelTypes,
              startDate: eventToEdit.startDate,
              endDate: eventToEdit.endDate,
              startTime: eventToEdit.startDate ? new Date(eventToEdit.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "09:00",
              endTime: eventToEdit.endDate ? new Date(eventToEdit.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "18:00",
              eventLocation: eventToEdit.location || "",
              eventAddress: eventToEdit.address || "",
              grossHours: eventToEdit.grossHours ? eventToEdit.grossHours.toString() : "",
              breakStartTime: eventToEdit.breakStartTime || "13:00",
              breakEndTime: eventToEdit.breakEndTime || "14:00",
              netHours: eventToEdit.netHours ? eventToEdit.netHours.toString() : "",
              hourlyRateCost: eventToEdit.hourlyRateCost ? eventToEdit.hourlyRateCost.toString() : "",
              hourlyRateSell: eventToEdit.hourlyRateSell ? eventToEdit.hourlyRateSell.toString() : "",
              personnelCounts: eventToEdit.personnelCounts || {}
            });
          }
        }
      } catch (error) {
        console.error("Errore nel caricare i dati dell'evento:", error);
      }
    }
  }, [eventId, isEditMode, clients]);
  
  // Auto-calculate gross hours when dates or times change
  useEffect(() => {
    const calculatedGrossHours = calculateGrossHours(
      formData.startDate,
      formData.endDate,
      formData.startTime,
      formData.endTime
    );
    
    if (calculatedGrossHours > 0) {
      setFormData(prev => ({
        ...prev,
        grossHours: calculatedGrossHours.toFixed(1)
      }));
    }
  }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime]);
  
  // Calculate net hours
  useEffect(() => {
    if (formData.grossHours) {
      const breakStart = formData.breakStartTime.split(':').map(Number);
      const breakEnd = formData.breakEndTime.split(':').map(Number);
      
      const breakStartMinutes = breakStart[0] * 60 + breakStart[1];
      const breakEndMinutes = breakEnd[0] * 60 + breakEnd[1];
      
      const breakDurationHours = (breakEndMinutes - breakStartMinutes) / 60;
      
      const netHoursValue = Math.max(0, Number(formData.grossHours) - breakDurationHours);
      
      setFormData(prev => ({
        ...prev,
        netHours: netHoursValue.toFixed(2)
      }));
    }
  }, [formData.grossHours, formData.breakStartTime, formData.breakEndTime]);
  
  const handlePersonnelChange = (personnelId: string) => {
    setFormData(prev => {
      const current = [...prev.selectedPersonnel];
      if (current.includes(personnelId)) {
        return {
          ...prev,
          selectedPersonnel: current.filter((id) => id !== personnelId)
        };
      } else {
        return {
          ...prev,
          selectedPersonnel: [...current, personnelId]
        };
      }
    });
  };
  
  const updateFormField = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return {
    formData,
    updateFormField,
    clients,
    isEditMode,
    handlePersonnelChange,
    locationSuggestions,
    setLocationSuggestions,
    addressSuggestions,
    setAddressSuggestions,
    showLocationSuggestions,
    setShowLocationSuggestions,
    showAddressSuggestions,
    setShowAddressSuggestions
  };
}
