import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

async function geocodeAddress(address: string): Promise<LatLngTuple | null> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return [parseFloat(lat), parseFloat(lon)];
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}

async function fetchRoute(coords: LatLngTuple[]): Promise<LatLngTuple[] | null> {
  const coordinates = coords.map(([lat, lon]) => [lon, lat]); // ORS expects [lon, lat]
  const body = {
    coordinates,
    format: "geojson"
  };

  try {
    const res = await fetch("https://api.openrouteservice.org/v2/directions/foot-walking/geojson", {
      method: "POST",
      headers: {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    const route: LatLngTuple[] = data.features[0].geometry.coordinates.map(
      ([lon, lat]: number[]) => [lat, lon]
    );

    return route;
  } catch (error) {
    console.error("Route fetch error:", error);
    return null;
  }
}

export default function MapPage() {
  const [inputs, setInputs] = useState(["", ""]); // You can expand this for more stops
  const [coords, setCoords] = useState<LatLngTuple[]>([]);
  const [route, setRoute] = useState<LatLngTuple[] | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (value: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const addStop = () => setInputs([...inputs, ""]);

  const handleSearch = async () => {
    const allCoords = await Promise.all(inputs.map(geocodeAddress));

    if (allCoords.includes(null)) {
      setError("One or more locations could not be found.");
      return;
    }

    const validCoords = allCoords as LatLngTuple[];
    setCoords(validCoords);
    setError("");

    const routed = await fetchRoute(validCoords);
    if (routed) {
      setRoute(routed);
    } else {
      setError("Could not fetch route.");
    }
  };

  const DEFAULT_POSITION: LatLngTuple = [37.4323, -121.8996]; // Milpitas

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1rem", background: "#f0f0f0" }}>
        {inputs.map((input, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Stop ${index + 1}`}
            value={input}
            onChange={(e) => handleInputChange(e.target.value, index)}
            style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
          />
        ))}
        <button onClick={addStop} style={{ marginRight: "1rem" }}>+ Add Stop</button>
        <button onClick={handleSearch}>Get Route</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div style={{ flex: 1 }}>
        <MapContainer center={coords[0] || DEFAULT_POSITION} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coords.map((point, index) => (
            <Marker key={index} position={point}>
              <Popup>{`Stop ${index + 1}`}</Popup>
            </Marker>
          ))}
          {route && <Polyline positions={route} color="blue" />}
        </MapContainer>
      </div>
    </div>
  );
}