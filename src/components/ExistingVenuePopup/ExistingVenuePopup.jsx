import React from 'react';
import './ExistingVenuePopup.css';

const Popup = ({ onClose }) => {
  return (
    <div className="popup-overlay" data-testid="popup-overlay">
      <div className="popup-content" data-testid="popup-content">
        <h2 data-testid="popup-title">The venue you are trying to add already exists.</h2>
        <p data-testid="popup-message">Please check the details and try again.</p>
        <button onClick={onClose} data-testid="popup-close-button">Close</button>
      </div>
    </div>
  );
};

export default Popup;
