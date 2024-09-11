import React from 'react';
import './PopUpEventsBooked.css';

const Popup = ({ title, studentName, date, time, venue, onClose }) => {
  return (
    <div className="popup-overlay" data-testid="popupEvents-1">
      <div className="popup-content">
        <h2>{title}</h2>
        <p><strong>Student:</strong> {studentName}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Venue:</strong> {venue}</p>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
