export type Coords = [number, number]; // [lat, lon]

export interface CrimeIncident {
  id: number;
  category: string;
  date: string;
  latitude: number;
  longitude: number;
  description?: string;
}