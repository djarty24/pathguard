import React, { useState, useEffect } from 'react';
import AddressForm from './components/AddressForm';
import Map from './components/Map';
import { fetchCrimes } from './utils/fetchCrimes';
import type { Coords, CrimeIncident } from './types';

function getBoundingBox(coords: Coords[]): [number, number, number, number] {
  // returns [minLat, minLon, maxLat, maxLon]
  const lats = coords.map((c) => c[0]);
  const lons = coords.map((c) => c[1]);
  return [Math.min(...lats), Math.min(...lons), Math.max(...lats), Math.max(...lons)];
}

function filterCrimesByRoute(crimes: CrimeIncident[], bbox: [number, number, number, number]) {
  const [minLat, minLon, maxLat, maxLon] = bbox;
  return crimes.filter(
    (c) =>
      c.latitude >= minLat && c.latitude <= maxLat && c.longitude >= minLon && c.longitude <= maxLon
  );
}

const App: React.FC = () => {
  const [route, setRoute] = useState<Coords[]>([]);
  const [crimes, setCrimes] = useState<CrimeIncident[]>([]);
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getCrimes() {
      if (route.length === 0) return;
      setLoadingCrimes(true);
      setError('');
      try {
        const bbox = getBoundingBox(route);
        const allCrimes = await fetchCrimes(bbox);
        const filtered = filterCrimesByRoute(allCrimes, bbox);
        setCrimes(filtered);
      } catch (err: any) {
        setError(err.message || 'Error fetching crimes');
      }
      setLoadingCrimes(false);
    }

    getCrimes();
  }, [route]);

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h1>SaferSteps</h1>
      <p>Find safe walking routes based on crime data in San Francisco.</p>
      <AddressForm onRouteReady={setRoute} />
      {loadingCrimes && <p>Loading crime data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {route.length > 0 && <Map route={route} crimes={crimes} />}
    </div>
  );
};

export default App;