
import React from 'react';
import GooglePlacesScript from '@/components/event/GooglePlacesScript';

interface GooglePlacesLoaderProps {
  onLoad: () => void;
}

const GooglePlacesLoader: React.FC<GooglePlacesLoaderProps> = ({ onLoad }) => {
  return <GooglePlacesScript onLoad={onLoad} />;
};

export default GooglePlacesLoader;
