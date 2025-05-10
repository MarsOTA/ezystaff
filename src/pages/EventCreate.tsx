
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/Layout";

// Custom components
import EventCreateHeader from "@/components/event/event-create/EventCreateHeader";
import EventCreateForm from "@/components/event/event-create/EventCreateForm";
import GooglePlacesLoader from "@/components/event/event-create/GooglePlacesLoader";

const EventCreate = () => {
  const locationHook = useLocation();
  const eventId = new URLSearchParams(locationHook.search).get("id");
  const autocompleteService = useRef<any>(null);
  
  const handleGoogleMapsLoaded = () => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
  };
  
  return (
    <Layout>
      <GooglePlacesLoader onLoad={handleGoogleMapsLoaded} />
      
      <EventCreateHeader isEditMode={!!eventId} />
      
      <Card>
        <CardHeader>
          <CardTitle>{eventId ? "Modifica evento" : "Crea nuovo evento"}</CardTitle>
          <CardDescription>
            {eventId 
              ? "Modifica i dettagli dell'evento esistente" 
              : "Compila il form per creare un nuovo evento"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EventCreateForm eventId={eventId} />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EventCreate;
