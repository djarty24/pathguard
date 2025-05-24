import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const redIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Props {
  crime: any;
}

export const CrimeMarker: React.FC<Props> = ({ crime }) => {
  const lat = parseFloat(crime.latitude);
  const lon = parseFloat(crime.longitude);

  if (isNaN(lat) || isNaN(lon)) return null;

  return (
    <Marker position={[lat, lon]} icon={redIcon}>
      <Popup>
        <strong>{crime.incident_category}</strong>
        <br />
        {crime.incident_description}
        <br />
        {new Date(crime.incident_datetime).toLocaleString()}
      </Popup>
    </Marker>
  );
};