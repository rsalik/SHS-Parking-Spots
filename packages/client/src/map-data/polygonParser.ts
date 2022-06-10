// A hacky solution to a dumb problem
import data from './data.csv';
import Papa from 'papaparse';
import { POLYGON_FILL_OPACITY, POLYGON_FREE, POLYGON_STROKE_OPACITY } from '../styles/PolygonStyle';

export interface SpotPolygon {
  spot: number;
  polygon: google.maps.Polygon;
}

export async function getPolygons() {
  let r = await fetch(data);
  let text = await r.text();

  let polygons: SpotPolygon[] = [];

  Papa.parse(text, {
    complete: function (results) {
      polygons = generatePolygonsFromCSV(results.data.splice(1));
    },
  });

  return polygons;
}

function generatePolygonsFromCSV(data: any[]) {
  let polygons: SpotPolygon[] = [];

  for (let line of data) {
    let unparsedCoords = line[0].replaceAll('POLYGON ((', '').replaceAll('))', '').split(', ');

    // 🙄
    let coords = unparsedCoords.map((o: string) => {
      // Of course, the lat and lng are reversed 😡
      return { lat: parseFloat(o.split(' ')[1]), lng: parseFloat(o.split(' ')[0]) };
    });

    polygons.push({
      spot: parseInt(line[1].replaceAll('Spot ', '')),
      polygon: new window.google.maps.Polygon({
        paths: coords,
        strokeColor: POLYGON_FREE,
        strokeOpacity: POLYGON_STROKE_OPACITY,
        strokeWeight: 2,
        fillColor: POLYGON_FREE,
        fillOpacity: POLYGON_FILL_OPACITY,
      }),
    });
  }

  return polygons;
}
