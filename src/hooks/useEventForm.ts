
import { useState, useEffect } from "react";
import { Event } from "@/types/event";
import { Client } from "@/pages/Clients";
import { safeLocalStorage } from "@/utils/fileUtils";
import { differenceInHours, addDays, isSameDay, differenceInDays } from "date-fns";

export const EVENTS_STORAGE_KEY = "app_events_data";
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
  staffCount: Record<string, number>;
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
}

export function useEventForm(eventId: string | null) {
  const isEditMode = !!eventId;
  
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    client: "",
    selectedPersonnel: [],
    staffCount: {},
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
    hourlyRateSell: ""
  });
  
  const [clients, setClients] = useState<Client[]>([]);
  const [locationSuggestions, setLocationSuggestions] = useState<PlacePrediction[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
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
              staffCount: eventToEdit.staffCount,
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
              hourlyRateSell: eventToEdit.hourlyRateSell ? eventToEdit.hourlyRateSell.toString() : ""
            });
          }
        }
      } catch (error) {
        console.error("Errore nel caricare i dati dell'evento:", error);
      }
    }
  }, [eventId, isEditMode, clients]);
  
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      try {
        const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
        const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
        
        const startDateTime = new Date(formData.startDate);
        startDateTime.setHours(startHours, startMinutes, 0, 0);
        
        const endDateTime = new Date(formData.endDate);
        endDateTime.setHours(endHours, endMinutes, 0, 0);
        
        const daysDiff = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60 * 24));
        
        let hoursPerDay = 0;
        if (startHours <= endHours) {
          hoursPerDay = endHours - startHours + (endMinutes - startMinutes) / 60;
        } else {
          hoursPerDay = 24 - startHours + endHours + (endMinutes - startMinutes) / 60;
        }
        
        let totalGrossHours = 0;
        
        if (isSameDay(startDateTime, endDateTime)) {
          totalGrossHours = hoursPerDay;
        } else {
          totalGrossHours = daysDiff * hoursPerDay;
        }
        
        setFormData(prev => ({
          ...prev,
          grossHours: totalGrossHours.toFixed(2)
        }));
      } catch (error) {
        console.error("Error calculating gross hours:", error);
      }
    }
  }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime]);
  
  useEffect(() => {
    if (formData.grossHours) {
      const breakStart = formData.breakStartTime.split(':').map(Number);
      const breakEnd = formData.breakEndTime.split(':').map(Number);
      
      const breakStartMinutes = breakStart[0] * 60 + breakStart[1];
      const breakEndMinutes = breakEnd[0] * 60 + breakEnd[1];
      
      const breakDurationHours = (breakEndMinutes - breakStartMinutes) / 60;
      
      let numberOfDays = 1;
      if (formData.startDate && formData.endDate) {
        numberOfDays = Math.max(1, differenceInDays(formData.endDate, formData.startDate) + 1);
      }
      
      const totalBreakTime = breakDurationHours * numberOfDays;
      
      const netHoursValue = Math.max(0, Number(formData.grossHours) - totalBreakTime);
      
      setFormData(prev => ({
        ...prev,
        netHours: netHoursValue.toFixed(2)
      }));
    }
  }, [formData.grossHours, formData.breakStartTime, formData.breakEndTime, formData.startDate, formData.endDate]);
  
  const handlePersonnelChange = (personnelId: string) => {
    setFormData(prev => {
      const current = [...prev.selectedPersonnel];
      const newStaffCount = { ...prev.staffCount };
      
      if (current.includes(personnelId)) {
        delete newStaffCount[personnelId];
        return {
          ...prev,
          selectedPersonnel: current.filter((id) => id !== personnelId),
          staffCount: newStaffCount
        };
      } else {
        newStaffCount[personnelId] = 1;
        return {
          ...prev,
          selectedPersonnel: [...current, personnelId],
          staffCount: newStaffCount
        };
      }
    });
  };

  const handleStaffCountChange = (personnelId: string, count: number) => {
    setFormData(prev => ({
      ...prev,
      staffCount: {
        ...prev.staffCount,
        [personnelId]: count
      }
    }));
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
    handleStaffCountChange,
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
