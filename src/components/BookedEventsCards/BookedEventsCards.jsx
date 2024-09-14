import React, { useState } from 'react';
import './BookedEventsCard.css';
import InfoIcon from '../../assets/icons/circle-info.svg';

const BookedEventsCard = ({ eventName, eventDetails, onClick }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
    <div className="event-cards-container">
    <section className="admin-event-card" data-testid="booked-events-card" onClick={handleCardClick}>
      <p data-testid="event-name" className="booking-title"><b>{eventName}</b></p>
      <p className="booking-details">Date: {eventDetails.date}</p>
      <p className="booking-details">Time: {eventDetails.time}</p>
      <p className="booking-details">Venue: {eventDetails.venue}</p>
      <img src={InfoIcon} alt="Info Icon" className="infoIcon" data-testid="info-icon"/>
    </section>
    </div>
      

      {isPopupOpen && (
        <div className="popup-overlay" data-testid="popupEvents-1">
          <div className="popup-content">
            <h2>{eventDetails.title}</h2>
            <p><strong>Student:</strong> {eventDetails.studentName}</p>
            <p><strong>Date:</strong> {eventDetails.date}</p>
            <p><strong>Time:</strong> {eventDetails.time}</p>
            <p><strong>Venue:</strong> {eventDetails.venue}</p>
            <button className="close-btn" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookedEventsCard;
