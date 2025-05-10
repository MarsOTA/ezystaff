
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { NavigateFunction } from "react-router-dom";
import { Client } from "@/pages/Clients";
import { EventFormData, PlacePrediction } from "@/hooks/useEventForm";
import { handleLocationSearch, handleAddressSearch } from "@/utils/eventUtils";
import EventLocationFields from "@/components/event/EventLocationFields";
import EventDateTimeSelector from "@/components/event/EventDateTimeSelector";
import EventHoursAndCosts from "@/components/event/EventHoursAndCosts";

interface EventDetailsTabProps {
  formData: EventFormData;
  updateFormField: (field: keyof EventFormData, value: any) => void;
  clients: Client[];
  navigate: NavigateFunction;
  locationSuggestions: PlacePrediction[];
  addressSuggestions: PlacePrediction[];
  showLocationSuggestions: boolean;
  showAddressSuggestions: boolean;
  setLocationSuggestions: React.Dispatch<React.SetStateAction<PlacePrediction[]>>;
  setAddressSuggestions: React.Dispatch<React.SetStateAction<PlacePrediction[]>>;
  setShowLocationSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAddressSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventDetailsTab: React.FC<EventDetailsTabProps> = ({
  formData,
  updateFormField,
  clients,
  navigate,
  locationSuggestions,
  addressSuggestions,
  showLocationSuggestions,
  showAddressSuggestions,
  setLocationSuggestions,
  setAddressSuggestions,
  setShowLocationSuggestions,
  setShowAddressSuggestions
}) => {
  const autocompleteService = useRef<any>(null);

  React.useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  }, []);

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
  
  const handleSelectLocationSuggestion = (suggestion: PlacePrediction) => {
    updateFormField('eventLocation', suggestion.description);
    setShowLocationSuggestions(false);
  };
  
  const handleSelectAddressSuggestion = (suggestion: PlacePrediction) => {
    updateFormField('eventAddress', suggestion.description);
    setShowAddressSuggestions(false);
  };

  return (
    <>
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
    </>
  );
};

export default EventDetailsTab;
