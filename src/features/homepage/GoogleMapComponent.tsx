import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { apiKey } from './constants';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '300px',
  minWidth: '300px',
};

interface GoogleMapComponentProps {
  center: { lat: number; lng: number };
  zoom: number;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ center, zoom }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  // Add console log to debug center coordinates
  React.useEffect(() => {
    console.log('Center coordinates:', center);
  }, [center]);

  const onUnmount = React.useCallback(function callback() {
    // map = null;
  }, []);

  // Check if center coordinates are valid numbers
  const isValidCenter = center && 
    typeof center.lat === 'number' && 
    typeof center.lng === 'number' &&
    !isNaN(center.lat) && 
    !isNaN(center.lng);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={isValidCenter ? center : { lat: 0, lng: 0 }} // Provide fallback coordinates
      zoom={zoom}
      onUnmount={onUnmount}
    >
      {isValidCenter && (
        <Marker
          position={center}
          visible={true} // Explicitly set visible prop
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default GoogleMapComponent;
