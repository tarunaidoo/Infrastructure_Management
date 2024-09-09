import React, { useState } from "react";
import Header from '../../components/NavigationHeader/NavigationHeader';
import './AdminAddVenuePage.css';
import AddPopup from '../../components/AddVenuePopup/AddVenuePopup';
import ConfirmPopup from '../../components/VenueConfirmedPopup/VenueConfirmedPopup';
import InvalidPopup from '../../components/InvalidVenuePopup/InvalidVenuePopup';


const AdminAddVenuePage = () => {
    // State for input fields
    const [formFields, setFormFields] = useState({
        building: '',
        buildingTag1: '',
        buildingTag2: '',
        buildingTag3: '',
        room: '',
        roomFeatures: '',
    });

    // State for managing popup visibility
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [showConfirmedPopup, setShowConfirmedPopup] = useState(false);
    const [showInvalidPopup, setShowInvalidPopup] = useState(false);

    // Update field values
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
    };

    // Handle submit action
    const handleSubmit = () => {
        const { building, buildingTag1, buildingTag2, buildingTag3, room, roomFeatures } = formFields;

        if (!building || !buildingTag1 || !buildingTag2 || !buildingTag3 || !room || !roomFeatures) {
            setShowInvalidPopup(true);
            return;
        }

        // Show confirmation popup
        setShowConfirmationPopup(true);
    };

    // Handle confirmation action
    const handleConfirm = () => {
        setShowConfirmationPopup(false);
        setShowConfirmedPopup(true);
    };

    // Handle cancellation action
    const handleCancel = () => {
        setShowConfirmationPopup(false);
    };

    // Handle close action for the confirmed popup
    const handleClose = () => {
        setShowConfirmedPopup(false);
        setShowInvalidPopup(false);
    };

    return (
        <>
            <Header title="Add a Venue"/>
            <div className="adding-form">
                <h2 className="heading-tags">Building:</h2>
                <input
                  type="text"
                  name="building"
                  placeholder="Enter building"
                  className="input-field"
                  value={formFields.building}
                  onChange={handleChange}
                />
                <h2 className="heading-tags">Building Tag 1:</h2>
                <input
                  type="text"
                  name="buildingTag1"
                  placeholder="Enter building tag 1"
                  className="input-field"
                  value={formFields.buildingTag1}
                  onChange={handleChange}
                />
                <h2 className="heading-tags">Building Tag 2:</h2>
                <input
                  type="text"
                  name="buildingTag2"
                  placeholder="Enter building tag 2"
                  className="input-field"
                  value={formFields.buildingTag2}
                  onChange={handleChange}
                />
                <h2 className="heading-tags">Building Tag 3:</h2>
                <input
                  type="text"
                  name="buildingTag3"
                  placeholder="Enter building tag 3"
                  className="input-field"
                  value={formFields.buildingTag3}
                  onChange={handleChange}
                />
                <h2 className="heading-tags">Room:</h2>
                <input
                  type="text"
                  name="room"
                  placeholder="Enter room"
                  className="input-field"
                  value={formFields.room}
                  onChange={handleChange}
                />
                <h2 className="heading-tags">Room Features:</h2>
                <input
                   type="text"
                   name="roomFeatures"
                   placeholder="Enter room description / features"
                   className="input-field"
                   value={formFields.roomFeatures}
                   onChange={handleChange}
                />
            </div>
            <button 
                className="add-venue-button" 
                onClick={handleSubmit}>Add venue
            </button>

            {showConfirmationPopup && 
                <AddPopup 
                    type="confirmation" 
                    onConfirm={handleConfirm} 
                    onCancel={handleCancel} 
                />
            }

            {showConfirmedPopup && 
                <ConfirmPopup 
                    type="confirmed" 
                    onClose={handleClose} 
                />
            }

            {showInvalidPopup && 
                <InvalidPopup 
                    type="invalid" 
                    onClose={handleClose} 
                />
            }
        </>
    );
}

export default AdminAddVenuePage;
