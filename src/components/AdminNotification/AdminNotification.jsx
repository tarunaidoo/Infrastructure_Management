import React from 'react';
import './AdminNotification.css'; // Ensure this path is correct for your project structure
import notificationIcon from '../../assets/icons/bookmark-filled-gold.svg'; // Import your notification icon

const AdminNotification = ({ issue, venue, onClose }) => {
  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup-content">
        <div className="notification-header">
          <h2>Today's Issues</h2>
          <img src={notificationIcon} alt="Notification Icon" />
        </div>
        <div className="notification-subheader">
          <h3>Title: {issue.TITLE}</h3>
        </div>
        <p><strong>Venue:</strong> {venue.VENUE_NAME}</p>
        <button className="notification-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AdminNotification;
