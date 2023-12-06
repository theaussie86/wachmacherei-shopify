'use client';
import GoogleMapReact from 'google-map-react';

function MapComponent() {
  const defaultProps = {
    center: {
      lat: 47.94194,
      lng: 10.30161
    },
    zoom: 17
  };
  return (
    <div className="h-64">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GA_MAPS_API_KEY || ''
        }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => {
          new maps.Marker({
            position: defaultProps.center,
            map,
            title: 'Wachmacherei Ottobeuren'
          });
        }}
      />
    </div>
  );
}

export default MapComponent;
