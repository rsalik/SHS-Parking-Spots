import React, { useEffect } from 'react';

import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { getPolygons, SpotPolygon } from '../map-data/polygonParser';
import { POLYGON_FILL_OPACITY, POLYGON_FREE, POLYGON_SELECTED_FILL_OPACITY, POLYGON_SELECTED_FREE } from '../styles/PolygonStyle';

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

interface MapProps extends google.maps.MapOptions {
  children?: React.ReactNode;
  onSelectSpot?: Function;
  style: { [key: string]: string };
}

export const Map: React.FC<MapProps> = ({ children, style, ...props }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [map, setMap] = React.useState<google.maps.Map>();
  const [polygons, setPolygons] = React.useState<SpotPolygon[]>([]);

  // Get Polygons
  useEffect(() => {
    getPolygons().then(setPolygons);
  }, []);

  const { onSelectSpot } = props;

  // Add Polygons to Map
  useEffect(() => {
    if (map) {
      polygons.forEach((s) => {
        s.polygon.setMap(map);
        s.polygon.addListener('click', () => {
          polygons.forEach((s) => {
            s.polygon.setOptions({
              fillColor: POLYGON_FREE,
              strokeColor: POLYGON_FREE,
              fillOpacity: POLYGON_FILL_OPACITY,
              zIndex: 1,
            });
          });

          s.polygon.setOptions({
            fillColor: POLYGON_SELECTED_FREE,
            strokeColor: POLYGON_SELECTED_FREE,
            fillOpacity: POLYGON_SELECTED_FILL_OPACITY,
            zIndex: 100,
          });

          onSelectSpot?.(s.spot);
        });
      });
    }
  }, [polygons, map, onSelectSpot]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          center: props.center,
          zoom: props.zoom,
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          tilt: 0,
          rotateControl: false,
          mapTypeControl: false,
          minZoom: 18,
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

export function MapContainer(props: { onSelectSpot?: Function }) {
  return (
    <div className="map-container">
      <Wrapper apiKey={process.env.REACT_APP_GM_API_KEY || ''} render={render}>
        <Map
          style={{ flexGrow: '1', height: '100%' }}
          center={{
            lat: 41.1542269,
            lng: -73.3286448,
          }}
          zoom={19}
          onSelectSpot={props.onSelectSpot}
        ></Map>
      </Wrapper>
    </div>
  );
}
