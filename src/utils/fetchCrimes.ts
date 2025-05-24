import type { CrimeIncident } from '../types';

const SF_CRIME_API_URL =
  'https://data.sfgov.org/resource/wg3w-h783.json?$limit=1000';

export async function fetchCrimes(
  bbox: [number, number, number, number] // [minLat, minLon, maxLat, maxLon]
): Promise<CrimeIncident[]> {
  const [minLat, minLon, maxLat, maxLon] = bbox;

  // Use SoQL for bounding box filter on lat/lon
  const where = `latitude > ${minLat} AND latitude < ${maxLat} AND longitude > ${minLon} AND longitude < ${maxLon}`;

  const url = `${SF_CRIME_API_URL}&$where=${encodeURIComponent(where)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch crime data: ${res.statusText}`);
  }
  const data = await res.json();

  // Map raw data to CrimeIncident type, parse numbers
  return data.map((item: any) => ({
    id: Number(item.incident_id),
    category: item.incident_category,
    date: item.incident_date,
    latitude: parseFloat(item.latitude),
    longitude: parseFloat(item.longitude),
    description: item.incident_description,
  }));
}