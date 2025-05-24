import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddressForm from '../components/AddressForm';
import type { Coords } from '../types';
import whereToTitle from '../assets/whereto.png';
import './AddressPage.css';

const AddressPage: React.FC = () => {
  const [, setRoute] = useState<Coords[]>([]);
  const navigate = useNavigate();

  function onRouteReady(coords: Coords[]) {
    setRoute(coords);
    navigate('/map', { state: { route: coords } });
  }

  return (
    <div className='addresspage'>
      <div className="address-page-container">
        <img src={whereToTitle} alt="Where to?" />
        <AddressForm onRouteReady={onRouteReady} />
      </div>
    </div>
  );
};

export default AddressPage;