import React from 'react';
import './PopUpIssuesReported.css';

function ReportedIssuePopup({ title, user, date, time, venue, room, description, onClose }) {
    return (
        <div className="popup-overlay" data-testid="popIssues-1">
            <div className="popup-content">
                <h2>{title}</h2>
                <p><strong>User:</strong> {user}</p>
                <p><strong>Date:</strong> {date}</p>
                <p><strong>Time:</strong> {time}</p>
                <p><strong>Venue:</strong> {venue}</p>
                <p><strong>Room:</strong> {room}</p>
                <p><strong>Description:</strong> {description}</p>
                <button onClick={onClose} aria-label="Close popup">Close</button>
            </div>
        </div>
    );
}

export default ReportedIssuePopup;
