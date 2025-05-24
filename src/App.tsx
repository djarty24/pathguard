import { Routes, Route } from "react-router-dom";
import Map from "./pages/MapPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Map />} />
      {/* Add other routes like /about, /settings here */}
    </Routes>
  );
}