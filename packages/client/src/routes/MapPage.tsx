import React from 'react';
import { MapContainer } from '../components/MapContainer';
import SelectedSpotOverlay from '../components/SelectedSpotOverlay';

export default function MapPage() {
  const [selectedSpot, setSelectedSpot] = React.useState<number | null>(null);

  return (
    <>
      <MapContainer onSelectSpot={setSelectedSpot} />
      {selectedSpot && <SelectedSpotOverlay spot={selectedSpot} />}
    </>
  );
}
