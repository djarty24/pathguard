import React from 'react';
import './HomePage.css';
import logoImage from '../assets/logo.png';
import titleText from '../assets/safe-steps-title.png';
import letsGoButtonText from '../assets/lets-go-button.png';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='homepage'>
      <div className='homepage-content'>
        <img src={logoImage} alt="Logo" style={{ width: 100, marginBottom: 0 }} />
        <img src={titleText} alt="Title" style={{ width: 200, marginTop: 25 }} />
        <p style={{lineHeight: '1.5rem'}}>Find safe walking routes in<br />San Francisco.</p>
        <button onClick={() => navigate('/address')}><img src={letsGoButtonText} alt="Let's Go" style={{ width: 150, marginTop: 0 }} /></button>
      </div>
    </div>
  );
};

export default HomePage;