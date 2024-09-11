import React, { useState } from 'react';
import './BookedEventsCard.css';
// import Popup from '../../components/PopUpEventsBooked/PopUpEventsBooked';
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
    <div className="cards-container">
    <section className="admin-event-card" data-testid="Card-1" onClick={handleCardClick}>
      <p><b>{eventName}</b></p>
      <p>Date: {eventDetails.date}</p>
      <p>Time: {eventDetails.time}</p>
      <p>Venue: {eventDetails.venue}</p>
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
