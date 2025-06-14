
import { EventFormData } from "@/types/eventForm";

export const combineDateTime = (date: Date | undefined, timeString: string): Date => {
  if (!date) return new Date();
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes);
  return newDate;
};

export const validateEventForm = (formData: EventFormData): string | null => {
  if (!formData.title || !formData.client || !formData.startDate || !formData.endDate) {
    return "Compila tutti i campi obbligatori (titolo, cliente, date)";
  }
  
  try {
    const fullStartDate = combineDateTime(formData.startDate, formData.startTime);
    const fullEndDate = combineDateTime(formData.endDate, formData.endTime);
    
    if (fullEndDate <= fullStartDate) {
      return "La data di fine deve essere successiva alla data di inizio";
    }
  } catch (error) {
    console.error("Error validating event form:", error);
    return "Errore di validazione del modulo";
  }
  
  return null;
};
