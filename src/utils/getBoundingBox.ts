type LatLng = [number, number];

export const getBoundingBox = (coords: LatLng[]) => {
  let north = -90, south = 90, east = -180, west = 180;

  coords.forEach(([lat, lon]) => {
    if (lat > north) north = lat;
    if (lat < south) south = lat;
    if (lon > east) east = lon;
    if (lon < west) west = lon;
  });

  // Expand box a little
  const padding = 0.01;
  return {
    north: north + padding,
    south: south - padding,
    east: east + padding,
    west: west - padding,
  };
};