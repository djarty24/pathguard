// utils/geocodeAddress.ts
import axios from "axios";

export async function geocodeAddress(address: string): Promise<[number, number] | null> {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
    });

    if (res.data && res.data.length > 0) {
      const { lat, lon } = res.data[0];
      return [parseFloat(lat), parseFloat(lon)];
    }

    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}