
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, FileText, Users } from "lucide-react";
import { toast } from "sonner";

// Custom hooks and components
import { useEventForm } from "@/hooks/useEventForm";
import { handleLocationSearch, handleAddressSearch, validateEventForm, saveEvent } from "@/utils/eventUtils";
import GooglePlacesScript from "@/components/event/GooglePlacesScript";
import EventLocationFields from "@/components/event/EventLocationFields";
import EventDateTimeSelector from "@/components/event/EventDateTimeSelector";
import EventHoursAndCosts from "@/components/event/EventHoursAndCosts";
import EventPlanner from "@/components/event/EventPlanner";

const EventCreate = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  
  const eventId = new URLSearchParams(locationHook.search).get("id");
  const autocompleteService = useRef<any>(null);
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
  useEffect(() => {
    if (formData.personnelCounts) {
      setPersonnelCounts(formData.personnelCounts);
    }
  }, [formData.personnelCounts]);
  
  const handleGoogleMapsLoaded = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  };
  
  const handleLocationChange = (value: string) => {
    updateFormField('eventLocation', value);
    handleLocationSearch(
      value, 
      autocompleteService.current, 
      setLocationSuggestions, 
      setShowLocationSuggestions
    );
  };
  
  const handleAddressChange = (value: string) => {
    updateFormField('eventAddress', value);
    handleAddressSearch(
      value, 
      autocompleteService.current, 
      setAddressSuggestions, 
      setShowAddressSuggestions
    );
  };
  
  const handleSelectLocationSuggestion = (suggestion: any) => {
    updateFormField('eventLocation', suggestion.description);
    setShowLocationSuggestions(false);
  };
  
  const handleSelectAddressSuggestion = (suggestion: any) => {
    updateFormField('eventAddress', suggestion.description);
    setShowAddressSuggestions(false);
  };
  
  const handlePersonnelCountChange = (personnelId: string, count: number) => {
    const newPersonnelCounts = {
      ...personnelCounts,
      [personnelId]: count
    };
    
    setPersonnelCounts(newPersonnelCounts);
    updateFormField('personnelCounts', newPersonnelCounts);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    <Layout>
      <GooglePlacesScript onLoad={handleGoogleMapsLoaded} />
      
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/events')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna agli eventi
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Modifica evento" : "Crea nuovo evento"}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Modifica i dettagli dell'evento esistente" 
              : "Compila il form per creare un nuovo evento"}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo evento *</Label>
                  <Input 
                    id="title" 
                    placeholder="Inserisci titolo evento" 
                    value={formData.title}
                    onChange={(e) => updateFormField('title', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select 
                    value={formData.client} 
                    onValueChange={(value) => updateFormField('client', value)}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Seleziona cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.length > 0 ? (
                        clients.map((clientItem) => (
                          <SelectItem key={clientItem.id} value={clientItem.id.toString()}>
                            {clientItem.companyName}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-clients" disabled>
                          Nessun cliente disponibile
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {clients.length === 0 && (
                    <p className="text-sm text-amber-500 mt-1">
                      Non ci sono clienti disponibili. 
                      <Button 
                        variant="link" 
                        className="px-1 py-0 h-auto text-sm" 
                        onClick={() => navigate('/client-create')}
                      >
                        Crea un cliente
                      </Button>
                    </p>
                  )}
                </div>
                
                <EventLocationFields 
                  eventLocation={formData.eventLocation}
                  eventAddress={formData.eventAddress}
                  showLocationSuggestions={showLocationSuggestions}
                  showAddressSuggestions={showAddressSuggestions}
                  locationSuggestions={locationSuggestions}
                  addressSuggestions={addressSuggestions}
                  onLocationChange={handleLocationChange}
                  onAddressChange={handleAddressChange}
                  onLocationSelect={handleSelectLocationSuggestion}
                  onAddressSelect={handleSelectAddressSuggestion}
                />
                
                <EventDateTimeSelector 
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  startTime={formData.startTime}
                  endTime={formData.endTime}
                  onStartDateChange={(date) => updateFormField('startDate', date)}
                  onEndDateChange={(date) => updateFormField('endDate', date)}
                  onStartTimeChange={(value) => updateFormField('startTime', value)}
                  onEndTimeChange={(value) => updateFormField('endTime', value)}
                />
                
                <EventHoursAndCosts 
                  grossHours={formData.grossHours}
                  netHours={formData.netHours}
                  breakStartTime={formData.breakStartTime}
                  breakEndTime={formData.breakEndTime}
                  hourlyRateCost={formData.hourlyRateCost}
                  hourlyRateSell={formData.hourlyRateSell}
                  onGrossHoursChange={(value) => updateFormField('grossHours', value)}
                  onBreakStartTimeChange={(value) => updateFormField('breakStartTime', value)}
                  onBreakEndTimeChange={(value) => updateFormField('breakEndTime', value)}
                  onHourlyRateCostChange={(value) => updateFormField('hourlyRateCost', value)}
                  onHourlyRateSellChange={(value) => updateFormField('hourlyRateSell', value)}
                />
              </TabsContent>
              
              <TabsContent value="planner" className="space-y-6">
                <EventPlanner 
                  selectedPersonnel={formData.selectedPersonnel}
                  onPersonnelChange={handlePersonnelChange}
                  personnelCounts={personnelCounts}
                  onPersonnelCountChange={handlePersonnelCountChange}
                  eventId={eventId}
                />
              </TabsContent>
            </Tabs>
            
            <div className="pt-4">
              <Button type="submit" className="w-full md:w-auto">
                {isEditMode ? "Aggiorna Evento" : "Crea Evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EventCreate;
