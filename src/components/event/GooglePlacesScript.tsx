
import React, { useEffect, useRef } from 'react';

interface GooglePlacesScriptProps {
  onLoad: () => void;
}

const GooglePlacesScript: React.FC<GooglePlacesScriptProps> = ({ onLoad }) => {
  const googleScriptLoaded = useRef(false);
  
  useEffect(() => {
    if (!googleScriptLoaded.current) {
      const initGoogleMapsServices = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          googleScriptLoaded.current = true;
          console.log("Google Maps API loaded successfully");
          onLoad();
        }
      };

      const googleMapsScript = document.createElement("script");
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC0HttgvqRiRYKBoRh_pnUsyqem4AqO1zY&libraries=places&callback=initGoogleMapsCallback`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      window.initGoogleMapsCallback = initGoogleMapsServices;
      
      document.head.appendChild(googleMapsScript);
      
      return () => {
        document.head.removeChild(googleMapsScript);
        delete window.initGoogleMapsCallback;
      };
    }
  }, [onLoad]);
  
  return null;
};

export default GooglePlacesScript;
