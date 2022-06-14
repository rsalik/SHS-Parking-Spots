// A hacky solution to a dumb problem
import data from './data.csv';
import Papa from 'papaparse';
import { POLYGON_FILL_OPACITY, POLYGON_FREE, POLYGON_STROKE_OPACITY, POLYGON_TAKEN } from '../styles/PolygonStyle';
import { getTakenSpots } from './apiHelper';

export interface SpotPolygon {
  spot: number;
  polygon: google.maps.Polygon;
}

export function getPolygons() {
  return new Promise<SpotPolygon[]>(async (resolve, reject) => {
    let r = await fetch(data);
    let text = await r.text();

    let polygons: SpotPolygon[] = [];

    Papa.parse(text, {
      complete: async function (results) {
        polygons = await generatePolygonsFromCSV(results.data.splice(1));

        // Is there a better way to do this than return a Promise?
        resolve(polygons);
      },
    });
  });
}

async function generatePolygonsFromCSV(data: any[]) {
  let polygons: SpotPolygon[] = [];

  let takenSpots = await getTakenSpots();

  if (!takenSpots || !takenSpots.length) takenSpots = [];

  for (let line of data) {
    let unparsedCoords = line[0].replaceAll('POLYGON ((', '').replaceAll('))', '').split(', ');

    // 🙄
    let coords = unparsedCoords.map((o: string) => {
      // Of course, the lat and lng are reversed 😡
      return { lat: parseFloat(o.split(' ')[1]), lng: parseFloat(o.split(' ')[0]) };
    });

    let spotNum = parseInt(line[1].replaceAll('Spot ', ''));
    if (takenSpots.includes(spotNum)) {
      polygons.push({
        spot: spotNum,
        polygon: new window.google.maps.Polygon({
          paths: coords,
          strokeColor: POLYGON_TAKEN,
          strokeOpacity: POLYGON_STROKE_OPACITY,
          strokeWeight: 2,
          fillColor: POLYGON_TAKEN,
          fillOpacity: POLYGON_FILL_OPACITY,
        }),
      });
    } else {
      polygons.push({
        spot: spotNum,
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
  }

  return polygons;
}
