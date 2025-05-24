import React, { useEffect, useRef } from 'react';
import type { Coords, CrimeIncident } from '../types';

// We'll use Leaflet for maps (free & open-source)
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type MapProps = {
  route: Coords[]; // [lat, lon] pairs
  crimes: CrimeIncident[];
};

const Map: React.FC<MapProps> = ({ route, crimes }) => {
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const crimeLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(route[0] || [37.7749, -122.4194], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Clear previous layers if any
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
    }
    if (crimeLayerRef.current) {
      crimeLayerRef.current.clearLayers();
    }

    // Draw route polyline
    if (route.length > 0) {
      const latLngs = route.map(([lat, lon]) => [lat, lon] as [number, number]);
      routeLayerRef.current = L.polyline(latLngs, { color: 'blue', weight: 5 }).addTo(
        mapRef.current!
      );

      // Fit map to route bounds
      const bounds = L.latLngBounds(latLngs);
      mapRef.current!.fitBounds(bounds, { padding: [50, 50] });
    }

    // Plot crime points
    crimeLayerRef.current = L.layerGroup();
    crimes.forEach((crime) => {
      const marker = L.circleMarker([crime.latitude, crime.longitude], {
        radius: 5,
        color: 'red',
        fillOpacity: 0.5,
      }).bindPopup(`<b>${crime.category}</b><br/>${crime.date}`);
      crimeLayerRef.current!.addLayer(marker);
    });
    crimeLayerRef.current.addTo(mapRef.current!);

    return () => {
      // cleanup if needed
    };
  }, [route, crimes]);

  return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default Map;