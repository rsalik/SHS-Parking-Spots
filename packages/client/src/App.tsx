import React from 'react';
import { MapContainer } from './components/MapContainer';
import SelectedSpotOverlay from './components/SelectedSpotOverlay';
import './styles/style.scss';

function App() {
  const [selectedSpot, setSelectedSpot] = React.useState<number | null>(null);

  return (
    <div className={`App theme--default`}>
      <MapContainer onSelectSpot={setSelectedSpot} />
      {selectedSpot && <SelectedSpotOverlay spot={selectedSpot} />}
    </div>
  );
}

export default App;
