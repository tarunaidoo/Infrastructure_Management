import React from 'react';
import './NotificationPopup.css'

const Popup = ({  arrayOfNames, onClose }) => {
    return (
      <div className="popup-overlay" data-testid="popupEvents-1">
        <div className="popup-content">
          <h2>Events Today</h2>
          {arrayOfNames.map((name, index) => (
          <p key={index}>{name}</p>
        ))}
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
  export default Popup;