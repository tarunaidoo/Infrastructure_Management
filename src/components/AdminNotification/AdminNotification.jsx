import React from 'react';
import notificationIcon from '../../assets/icons/bookmark-filled-gold.svg';
import './AdminNotification.css';

const AdminNotification = ({ arrayOfIssues, arrayOfVenues, onClose }) => {
  return (
    <main className="notification-popup-overlay" data-testid="popupIssues-1">
      <label>Notification</label>
      <section className="notification-popup-content">
        <section className="notification-header">
          <label className="notification-subheader">
            <img src={notificationIcon} alt="Notification Icon" />
          </label>
          <h2>Today's Issues</h2>
        </section>
        <section className="notification-popup-messages">
          {arrayOfIssues.length > 0 ? (
            arrayOfIssues.map((issue, index) => (
              <p key={index}>
                {issue} at {arrayOfVenues[index]}
              </p>
            ))
          ) : (
            <p>No issues reported today.</p>
          )}
        </section>
        <button className="notification-close-btn" onClick={onClose}>Close</button>
      </section>
    </main>
  );
};

export default AdminNotification;
