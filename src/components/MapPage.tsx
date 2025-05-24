import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import { fetchCrimes } from '../utils/fetchCrimes';
import type { Coords, CrimeIncident } from '../types';
import './MapPage.css'
import mapAndCrimeDataText from '../assets/map-and-crime-data.png';

function getBoundingBox(coords: Coords[]): [number, number, number, number] {
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

const MapPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const route = (location.state as { route?: Coords[] })?.route || [];
  const [crimes, setCrimes] = useState<CrimeIncident[]>([]);
  const [loadingCrimes, setLoadingCrimes] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!route.length) {
      // If no route was passed, send user back to address page
      navigate('/address');
      return;
    }

    async function getCrimes() {
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
  }, [route, navigate]);

  return (
    <div className='map-page' style={{ maxWidth: 900, margin: 'auto', padding: 10 }}>
      <img src={mapAndCrimeDataText} alt="Logo" style={{ width: '75%', marginBottom: 10, marginTop: 10 }} />
      {loadingCrimes && <p>Loading crime data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {route.length > 0 && <Map route={route} crimes={crimes} />}
    </div>
  );
};

export default MapPage;