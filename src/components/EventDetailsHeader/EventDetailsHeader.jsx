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
    <article className="Event-Header">
          <img onClick={handleBackClick} src={left} alt='Event-Icon' className='Event-Back-img' />
        <h1 onClick={handleBackClick}>Event Details</h1>
    </article>
  );
}

export default Header;
