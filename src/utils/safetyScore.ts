import type { LatLngTuple } from "leaflet";

export const getSafetyScore = (crimes: any[], routeCoords: LatLngTuple[]): number => {
  // Basic scoring: subtract points for each crime within 200m of route
  let score = 100;

  for (const coord of routeCoords) {
    const nearbyCrimes = crimes.filter((crime) => {
      const lat = parseFloat(crime.latitude);
      const lon = parseFloat(crime.longitude);
      const distance = haversineDistance(coord, [lat, lon]);
      return distance < 0.2; // ~200m
    });

    score -= nearbyCrimes.length * 0.5;
  }

  return Math.max(0, Math.round(score));
};

const haversineDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const R = 6371; // km
  const toRad = (deg: number) => deg * Math.PI / 180;

  const dLat = toRad(coord2[0] - coord1[0]);
  const dLon = toRad(coord2[1] - coord1[1]);

  const lat1 = toRad(coord1[0]);
  const lat2 = toRad(coord2[0]);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};