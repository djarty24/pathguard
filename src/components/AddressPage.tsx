import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/AddressForm';
import type { Coords } from '../types';

const AddressPage: React.FC = () => {
  const [, setRoute] = useState<Coords[]>([]);
  const navigate = useNavigate();

  function onRouteReady(coords: Coords[]) {
    setRoute(coords);
    // Pass route state to map page via navigation state or URL params
    navigate('/map', { state: { route: coords } });
  }

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Enter Start and End Addresses</h2>
      <AddressForm onRouteReady={onRouteReady} />
    </div>
  );
};

export default AddressPage;