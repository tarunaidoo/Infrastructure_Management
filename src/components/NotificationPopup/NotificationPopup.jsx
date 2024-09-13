import React from 'react';
import './NotificationPopup.css';

const NotificationPopup = ({ arrayOfNames, onClose }) => {
  return (
    <div className="popup-overlay" data-testid="popupEvents-1">
      <div className="popup-content">
        <h2>Events Today</h2>
        {arrayOfNames.length > 0 ? (
          arrayOfNames.map((name, index) => <p key={index}>{name}</p>)
        ) : (
          <p>No events today.</p>
        )}
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NotificationPopup;
