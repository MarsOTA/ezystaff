
import { useState } from "react";
import { PlacePrediction } from "@/types/eventForm";

export const useEventSuggestions = () => {
  const [locationSuggestions, setLocationSuggestions] = useState<PlacePrediction[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  return {
    locationSuggestions,
    setLocationSuggestions,
    addressSuggestions,
    setAddressSuggestions,
    showLocationSuggestions,
    setShowLocationSuggestions,
    showAddressSuggestions,
    setShowAddressSuggestions
  };
};
