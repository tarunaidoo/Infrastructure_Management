import React from 'react';
import './AddVenuePopup.css';

const Popup = ({ onConfirm, onCancel }) => {
    return (
        <main className="popup-overlay">
            <section className="popup">
                <label className="popup-heading">Confirmation</label>
                <label className="popup-message">Do you want to add this venue?</label>
                <section className="popup-buttons">
                    <button className="popup-button" onClick={onConfirm}>Yes</button>
                    <button className="popup-button" onClick={onCancel}>No</button>
                </section>
            </section>
        </main>
    );
};

export default Popup;
