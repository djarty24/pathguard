import React, { useState } from 'react';
import type { Coords } from '../types';

type AddressFormProps = {
  onRouteReady: (routeCoords: Coords[]) => void;
};

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

const AddressForm: React.FC<AddressFormProps> = ({ onRouteReady }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function geocode(address: string): Promise<Coords> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data || data.length === 0) throw new Error('Address not found');
    const lat = parseFloat(data[0].lat);
    const lon = parseFloat(data[0].lon);
    return [lat, lon];
  }

  async function fetchRoute(startCoords: Coords, endCoords: Coords): Promise<Coords[]> {
    // ORS expects [lon, lat]
    const startLonLat = [startCoords[1], startCoords[0]];
    const endLonLat = [endCoords[1], endCoords[0]];

    const url = `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${ORS_API_KEY}&start=${startLonLat[0]},${startLonLat[1]}&end=${endLonLat[0]},${endLonLat[1]}`;
    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Routing failed: ${text}`);
    }
    const data = await res.json();
    if (
      !data ||
      !data.features ||
      !data.features[0].geometry.coordinates ||
      data.features[0].geometry.coordinates.length === 0
    )
      throw new Error('No route found');

    // ORS returns coords as [lon, lat], convert to [lat, lon]
    return data.features[0].geometry.coordinates.map(([lon, lat]: number[]) => [lat, lon]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const startCoords = await geocode(start);
      const endCoords = await geocode(end);
      const route = await fetchRoute(startCoords, endCoords);
      onRouteReady(route);
    } catch (err: any) {
      setError(err.message || 'Failed to get route');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Start address"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
        style={{ marginRight: 10, width: 250 }}
      />
      <input
        type="text"
        placeholder="End address"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
        style={{ marginRight: 10, width: 250 }}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Get Route'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default AddressForm;