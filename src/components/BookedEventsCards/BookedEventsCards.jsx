import React, { useState } from 'react';
import './BookedEventsCard.css';
import Popup from '../../components/PopUpEventsBooked/PopUpEventsBooked';
import InfoIcon from '../../assets/icons/circle-info.svg';

const BookedEventsCard = ({ eventName, eventDetails }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="booked-events-card" data-testid="booked-events-card" onClick={handleCardClick}>
        <span className="event-name" data-testid="event-name">{eventName}</span>
        <img src={InfoIcon} alt="Info Icon" className="infoIcon" data-testid="info-icon"/>
      </div>
      {isPopupOpen && (
        <div className="popup-overlay" data-testid="popupEvents-1">
          <div className="popup-content">
            <h2>{eventDetails.title}</h2>
            <p><strong>Student:</strong> {eventDetails.studentName}</p>
            <p><strong>Date:</strong> {eventDetails.date}</p>
            <p><strong>Time:</strong> {eventDetails.time}</p>
            <p><strong>Venue:</strong> {eventDetails.venue}</p>
            <p><strong>Room:</strong> {eventDetails.room}</p>
            <button className="close-btn" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookedEventsCard;
