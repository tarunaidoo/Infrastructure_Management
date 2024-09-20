import React from 'react';
import notificationIcon from '../../assets/icons/bookmark-filled-gold.svg';
import './NotificationPopup.css';

const NotificationPopup = ({ arrayOfNames, onClose, arrayOfCorrespondingvenues }) => {
  return (
    <main className="notification-popup-overlay" data-testid="popupEvents-1">
      <section className="notification-popup-content">
        <section className='notification-header'>
          <label className='notification-subheader'>
            <img src={notificationIcon} alt="Notification Icon" />
          </label>
          <h2>Events Today</h2>
        </section>
        <section className="notification-popup-messages">
          {arrayOfNames.length > 0 ? (
            arrayOfNames.map((name, index) => (
              <p key={index}>
                {name} at {arrayOfCorrespondingvenues[index]}
              </p>
            ))
          ) : (
            <p>No events are scheduled for today.</p>
          )}
        </section>
        <button className="notification-close-btn" onClick={onClose}>Close</button>
      </section>
    </main>
  );
};

export default NotificationPopup;
