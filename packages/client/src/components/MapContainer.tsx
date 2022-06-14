import React, { useEffect, useState } from 'react';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { getPolygons, SpotPolygon } from '../map-data/polygonParser';
import {
  POLYGON_FILL_OPACITY,
  POLYGON_FREE,
  POLYGON_SELECTED_FILL_OPACITY,
  POLYGON_SELECTED_FREE,
  POLYGON_SELECTED_TAKEN,
  POLYGON_TAKEN,
} from '../styles/PolygonStyle';
import { getTakenSpots } from '../map-data/apiHelper';

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

interface MapProps extends google.maps.MapOptions {
  children?: React.ReactNode;
  onSelectSpot?: Function;
  style: { [key: string]: string };
  spot?: number;
}

export const Map: React.FC<MapProps> = ({ children, style, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<google.maps.Map>();
  const [polygons, setPolygons] = useState<SpotPolygon[]>([]);

  const [takenSpots, setTakenSpots] = useState<number[]>([]);

  // Get Polygons & Taken Spots
  useEffect(() => {
    getPolygons().then(setPolygons);
    getTakenSpots().then(setTakenSpots);
  }, []);

  // For checkout maps that show a specific spot, set the center to that spot
  useEffect(() => {
    if (polygons.length && props.spot) {
      const spot = polygons.find((p) => p.spot === props.spot);
      if (spot) {
        map?.setCenter({ lat: spot.polygon.getPath().getAt(0).lat(), lng: spot.polygon.getPath().getAt(0).lng() });
      }
    }
  }, [polygons, props.spot, map]);

  const { onSelectSpot } = props;

  // Add Polygons to Map
  useEffect(() => {
    if (map) {
      polygons.forEach((s) => {
        s.polygon.setMap(map);

        if (!props.spot) {
          s.polygon.addListener('click', () => {
            polygons.forEach((s) => {
              if (takenSpots.includes(s.spot)) {
                s.polygon.setOptions({
                  fillColor: POLYGON_TAKEN,
                  strokeColor: POLYGON_TAKEN,
                  fillOpacity: POLYGON_FILL_OPACITY,
                  zIndex: 1,
                });
              } else {
                s.polygon.setOptions({
                  fillColor: POLYGON_FREE,
                  strokeColor: POLYGON_FREE,
                  fillOpacity: POLYGON_FILL_OPACITY,
                  zIndex: 1,
                });
              }
            });

            if (takenSpots.includes(s.spot)) {
              s.polygon.setOptions({
                fillColor: POLYGON_SELECTED_TAKEN,
                strokeColor: POLYGON_SELECTED_TAKEN,
                fillOpacity: POLYGON_SELECTED_FILL_OPACITY,
                zIndex: 100,
              });
            } else {
              s.polygon.setOptions({
                fillColor: POLYGON_SELECTED_FREE,
                strokeColor: POLYGON_SELECTED_FREE,
                fillOpacity: POLYGON_SELECTED_FILL_OPACITY,
                zIndex: 100,
              });
            }

            onSelectSpot?.(s.spot);
          });
        }

        if (props.spot === s.spot) {
          s.polygon.setOptions({
            fillColor: POLYGON_SELECTED_FREE,
            strokeColor: POLYGON_SELECTED_FREE,
            fillOpacity: POLYGON_SELECTED_FILL_OPACITY,
            zIndex: 100,
          });
        }
      });
    }
  }, [polygons, map, onSelectSpot, props.spot, takenSpots]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: { lat: 41.1542269, lng: -73.3286448 },
          zoom: props.zoom,
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          tilt: 0,
          rotateControl: false,
          mapTypeControl: false,
          minZoom: 18,
          disableDefaultUI: props.disableDefaultUI,
          gestureHandling: props.gestureHandling,
          keyboardShortcuts: props.keyboardShortcuts,
          fullscreenControl: false,
          restriction: {
            latLngBounds: {
              north: 41.156819,
              east: -73.325482,
              south: 41.152392,
              west: -73.331396,
            },
          },
        })
      );
    }
  }, [ref, map, props]);

  useEffect(() => {
    if (map) {
      getPolygons();
    }
  }, [map]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

export function MapContainer(props: { onSelectSpot?: Function; spot?: number; disableUI?: boolean }) {
  return (
    <div className="map-container">
      <Wrapper apiKey={process.env.REACT_APP_GM_API_KEY || ''} render={render}>
        <Map
          style={{ flexGrow: '1', height: '100%' }}
          zoom={props.spot ? 20.5 : 19}
          gestureHandling={props.spot === undefined ? 'control' : 'none'}
          keyboardShortcuts={props.spot === undefined}
          disableDefaultUI={props.disableUI}
          onSelectSpot={props.onSelectSpot}
          spot={props.spot}
        ></Map>
      </Wrapper>
    </div>
  );
}
