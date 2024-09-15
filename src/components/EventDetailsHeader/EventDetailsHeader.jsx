import React from 'react';
import { useNavigate } from 'react-router-dom';
import './EventDetailsHeader.css';
import left from '../../assets/icons/chevron-left.svg';

function Header() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/student-home'); // Navigate to the StudentHomePage (or adjust path if different)
  };

  return (
    <header className="Event-Header">
      <section className="Event-Header-Block">
        <button className='Event-Back' onClick={handleBackClick}>
          <img src={left} alt='Event-Icon' className='Event-Back-img' />
        </button>
        <h1>Event Details</h1>
      </section>
    </header>
  );
}

export default Header;
