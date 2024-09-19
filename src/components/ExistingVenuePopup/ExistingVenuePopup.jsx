import React from 'react';
import './ExistingVenuePopup.css';

const Popup = ({ onClose }) => {
  return (
    <main className="popup-overlay" data-testid="popup-overlay">
      <section className="popup-content" data-testid="popup-content">
        <h2 data-testid="popup-title">The venue you are trying to add already exists.</h2>
        <p data-testid="popup-message">Please check the details and try again.</p>
        <button onClick={onClose} data-testid="popup-close-button">Close</button>
      </section>
    </main>
  );
};

export default Popup;
