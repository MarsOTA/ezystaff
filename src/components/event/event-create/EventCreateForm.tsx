
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Custom hooks and components
import { validateEventForm, saveEvent } from "@/utils/eventUtils";
import EventDetailsTab from "./tabs/EventDetailsTab";
import EventPlannerTab from "./tabs/EventPlannerTab";
import { useEventForm } from "@/hooks/useEventForm";

interface EventCreateFormProps {
  eventId: string | null;
}

const EventCreateForm: React.FC<EventCreateFormProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [personnelCounts, setPersonnelCounts] = useState<Record<string, number>>({});
  
  const {
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
  } = useEventForm(eventId);
  
  // Load personnel counts from form data if available
  React.useEffect(() => {
    if (formData.personnelCounts) {
      setPersonnelCounts(formData.personnelCounts);
    }
  }, [formData.personnelCounts]);
  
  const handlePersonnelCountChange = (personnelId: string, count: number) => {
    // Don't allow negative counts
    if (count < 0) return;
    
    const newPersonnelCounts = {
      ...personnelCounts,
      [personnelId]: count
    };
    
    setPersonnelCounts(newPersonnelCounts);
    updateFormField('personnelCounts', newPersonnelCounts);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const validationError = validateEventForm(formData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Include personnel counts in the save data
    const result = saveEvent({
      ...formData,
      personnelCounts
    }, eventId, clients);
    
    if (result.success) {
      toast.success(result.message);
      navigate("/events");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Dettagli Evento
          </TabsTrigger>
          <TabsTrigger value="planner" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Event Planner
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-6">
          <EventDetailsTab 
            formData={formData}
            updateFormField={updateFormField}
            clients={clients}
            navigate={navigate}
            locationSuggestions={locationSuggestions}
            addressSuggestions={addressSuggestions}
            showLocationSuggestions={showLocationSuggestions}
            showAddressSuggestions={showAddressSuggestions}
            setLocationSuggestions={setLocationSuggestions}
            setAddressSuggestions={setAddressSuggestions}
            setShowLocationSuggestions={setShowLocationSuggestions}
            setShowAddressSuggestions={setShowAddressSuggestions}
          />
        </TabsContent>
        
        <TabsContent value="planner" className="space-y-6">
          <EventPlannerTab
            selectedPersonnel={formData.selectedPersonnel}
            onPersonnelChange={handlePersonnelChange}
            personnelCounts={personnelCounts}
            onPersonnelCountChange={handlePersonnelCountChange}
            eventId={eventId}
          />
        </TabsContent>
      </Tabs>
      
      <div className="pt-4">
        <Button 
          type="submit" 
          className="w-full md:w-auto"
          onClick={(e) => {
            // Extra protection against form submission causing navigation
            if (e.target === e.currentTarget) {
              e.stopPropagation();
            }
          }}
        >
          {isEditMode ? "Aggiorna Evento" : "Crea Evento"}
        </Button>
      </div>
    </form>
  );
};

export default EventCreateForm;
