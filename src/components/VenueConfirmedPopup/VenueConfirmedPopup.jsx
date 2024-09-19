import React from 'react';
import './VenueConfirmedPopup.css'; // Make sure to import the CSS file

const Popup = ({ type, onConfirm, onCancel, onClose }) => {
    let heading, message, confirmButton, cancelButton;
    
    if (type === 'confirmation') {
        heading = "Confirmation";
        message = "Do you want to add this venue?";
        confirmButton = <button className="popup-button" onClick={onConfirm}>Yes</button>;
        cancelButton = <button className="popup-button" onClick={onCancel}>No</button>;
    } else if (type === 'confirmed') {
        heading = "Confirmed!";
        message = "The venue has been added.";
        confirmButton = <button className="popup-button" onClick={onClose}>Close</button>;
        cancelButton = null;  // No cancel button for this popup
    } else if (type === 'invalid') {
        heading = "Invalid details";
        message = "Please fill in all fields.";
        confirmButton = <button className="popup-button" onClick={onClose}>Close</button>;
        cancelButton = null;  // No cancel button for this popup
    }

    return (
        <main className="popup-overlay">
            <section className="popup">
                <label className="popup-heading">{heading}</label>
                <label className="popup-message">{message}</label>
                <section className="popup-buttons">
                    {confirmButton}
                    {cancelButton}
                </section>
            </section>
        </main>
    );
};

export default Popup;
