import React from 'react';
import './AddVenuePopup.css';

const Popup = ({ onConfirm, onCancel }) => {
    return (
        <div className="popup-overlay">
            <div className="popup">
                <div className="popup-heading">Confirmation</div>
                <div className="popup-message">Do you want to add this venue?</div>
                <div className="popup-buttons">
                    <button className="popup-button" onClick={onConfirm}>Yes</button>
                    <button className="popup-button" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
