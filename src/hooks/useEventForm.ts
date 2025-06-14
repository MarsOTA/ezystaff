
import { useState, useEffect } from "react";
import { Event, EVENTS_STORAGE_KEY } from "@/types/event";
import { Client } from "@/pages/Clients";
import { safeLocalStorage } from "@/utils/fileUtils";
import { EventFormData, CLIENTS_STORAGE_KEY } from "@/types/eventForm";
import { calculateGrossHours, calculateNetHours } from "@/utils/eventCalculations";
import { useEventSuggestions } from "./useEventSuggestions";

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
  const suggestions = useEventSuggestions();
  
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
  
  // Calculate net hours with dates consideration for multi-day events
  useEffect(() => {
    const netHours = calculateNetHours(
      formData.grossHours,
      formData.breakStartTime,
      formData.breakEndTime,
      formData.startDate,
      formData.endDate
    );
    
    if (netHours !== formData.netHours) {
      setFormData(prev => ({
        ...prev,
        netHours
      }));
    }
  }, [formData.grossHours, formData.breakStartTime, formData.breakEndTime, formData.startDate, formData.endDate, formData.netHours]);
  
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
    ...suggestions
  };
}
