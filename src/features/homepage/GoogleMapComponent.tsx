import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { apiKey } from './constants';

const containerStyle = {
  width: '100%',
  height: '400px',
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

  const onLoad = React.useCallback(function callback(map: any) {
    // Fit bounds if needed
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
  }, [center]);

  const onUnmount = React.useCallback(function callback(map: any) {
    map = null;
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default GoogleMapComponent;
