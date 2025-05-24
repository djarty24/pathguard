import axios from "axios";

export const fetchRoute = async (startAddress: string, endAddress: string): Promise<[number, number][]> => {
  const geocode = async (address: string) => {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: address,
        format: "json",
        limit: 1,
      },
    });
    const data = res.data[0];
    return [parseFloat(data.lat), parseFloat(data.lon)] as [number, number];
  };

  try {
    const [startCoords, endCoords] = await Promise.all([geocode(startAddress), geocode(endAddress)]);

    const routeRes = await axios.get("https://router.project-osrm.org/route/v1/driving/" +
      `${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}`,
      {
        params: {
          overview: "full",
          geometries: "geojson",
        },
      }
    );

    return routeRes.data.routes[0].geometry.coordinates.map(
      ([lon, lat]: [number, number]) => [lat, lon]
    );
  } catch (error) {
    console.error("Error fetching route:", error);
    return [];
  }
};