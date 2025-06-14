
import { PlacePrediction } from "@/types/eventForm";

// Define the missing Google Maps types to fix TypeScript errors
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
