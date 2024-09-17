import "./AdminEditVenuePage.css";
import React, { useState, useEffect, useMemo } from "react";
import Switch from "react-switch";
import { useNavigate, useLocation } from "react-router-dom";

import arrowIcon from '../../assets/icons/chevron-left.svg';
import { getVenue, getFeatures, getFeatureNames, updateVenue, updateVenueFeatures } from "../../services/AdminEditVenuePage/AdminEditVenuePage.service";
import Popup from "../../components/Popup/Popup";

const AdminEditVenuePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const previousPageDetails = useMemo(() => location.state || {}, [location.state]);

    const [venueID, setVenueID] = useState("");
    const [venueName, setVenueName] = useState("");
    const [capacity, setCapacity] = useState("");
    const [isAvailable, setIsAvailable] = useState(false);
    const [features, setFeatures] = useState([]);
    const [roomFeatureIDs, setroomFeatureIDs] = useState([]);
    const [allFeatures, setAllFeatures] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState('');
    const [message, setMessage] = useState("");
    // const [validInfo, setValidInfo] = useState(true);
    const [loading, setLoading] = useState(false); // New state for loading

    const [initialValues, setInitialValues] = useState({
        venueName: "",
        capacity: "",
        isAvailable: false,
        features: []
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Show loading popup
            try {
                const venueData = await getVenue(previousPageDetails.VENUE_NAME);
                if (venueData) {
                    setVenueID(venueData.venue_id);
                    setVenueName(venueData.venue_name);
                    setCapacity(venueData.venue_capacity);
                    setIsAvailable(venueData.venue_status === "Available");
                    const venueFeatures = await getFeatures(venueData.venue_id);
                    if (venueFeatures) {
                        const roomFeatureIDData = venueFeatures.featureDetails.map(detail => detail.ROOM_FEATURE_ID);
                        const featureIds = venueFeatures.featureDetails.map(detail => detail.FEATURE_ID);
                        setroomFeatureIDs(roomFeatureIDData);
                        setFeatures(featureIds);
                        setInitialValues({
                            venueName: venueData.venue_name,
                            capacity: venueData.venue_capacity,
                            isAvailable: venueData.venue_status === "Available",
                            features: featureIds
                        });
                    }
                } else {
                    setVenueName("Error");
                    setCapacity(-1);
                    setFeatures([]);
                }

                const featureNames = await getFeatureNames();
                featureNames ? setAllFeatures(featureNames) : setAllFeatures([]);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Hide loading popup
            }
        };

        fetchData();
    }, [previousPageDetails]);

    const handleFeatureToggle = (featureId) => {
        setFeatures(prevFeatures =>
            prevFeatures.includes(featureId)
                ? prevFeatures.filter(id => id !== featureId)
                : [...prevFeatures, featureId]
        );
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        if (popupType === 'success') {
            console.log("successful");
        }
        //navigate('/'); // Navigate to the home page 
    };

    const handleSwitchChange = (checked) => {
        setIsAvailable(checked);
    };

    const handleUpdateVenueClick = () => {
        setPopupType('confirmation');
        setShowPopup(true);
    };

    const handleHeaderBackIconClick = () => {
        const backPageDetails = {
          SOURCE_PAGE: previousPageDetails.SOURCE_PAGE,
          USER_ID: previousPageDetails.USER_ID,
          DESTINATION_PAGE: previousPageDetails.DESTINATION_PAGE,
          CAMPUS_NAME: previousPageDetails.CAMPUS_NAME,
          BUILDING_ID: previousPageDetails.BUILDING_ID,
          BUILDING_NAME: previousPageDetails.BUILDING_NAME
        }
        navigate("/room-selection", { state: backPageDetails });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // Reset error state before validation
        // setValidInfo(true);
    
        // Validate the form inputs
        if (!venueName) {
            setPopupType('venueNameError');
            setShowPopup(true);
            setMessage("Please provide a valid venue name.");
            return;
        }
        
        if (!capacity || isNaN(capacity) || capacity <= 0) {
            setPopupType('capacityError');
            setShowPopup(true);
            setMessage("Please provide a valid capacity.");
            return;
        }
    
        if (features.length === 0) {
            setPopupType('featuresError');
            setShowPopup(true);
            setMessage("Please select at least one feature.");
            return;
        }
    
        // Check if no changes have been made
        const noChangesMade = (
            venueName === initialValues.venueName &&
            capacity === initialValues.capacity &&
            isAvailable === initialValues.isAvailable &&
            features.length === initialValues.features.length &&
            features.every(id => initialValues.features.includes(id))
        );
    
        if (noChangesMade) {
            setPopupType('noChangesError');
            setMessage("No changes have been made.");
            setShowPopup(true);
            return;
        }
    
        // If there are valid changes, proceed with the update
        handleUpdateVenueClick();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true); // Show loading popup

        // Determine status based on isAvailable
        const updatedStatus = isAvailable ? "Available" : "Unavailable";

        // Prepare the data for updating the venue
        const updateVenueData = {
            VENUE_NAME: venueName,
            BUILDING_ID: previousPageDetails.BUILDING_ID,
            VENUE_CAPACITY: capacity,
            VENUE_STATUS: updatedStatus
        };

        try {
            // Update venue details
            await updateVenue(updateVenueData, venueID);
            console.log("Updated Venue Name:", venueName);
            console.log("Updated Capacity:", capacity);
            console.log("Venue Status:", updatedStatus);

            // Update venue features
            await updateVenueFeatures(venueID, features);
            console.log("Selected Features:", features);
            console.log("Room Feature ID:", roomFeatureIDs);

            // Show success popup
            setPopupType('success');
            setShowPopup(true);
            navigate("/admin-home");

        } catch (error) {
            console.error("Error updating venue:", error);
            // Handle the error appropriately
            setPopupType('error');
            setMessage("Failed to update the venue.");
            setShowPopup(true);
        } finally {
            setLoading(false); // Hide loading popup
        }
    };

    return (
        <main className="edit-venue-layout" data-testid="edit-venue-layout">
        <article className='edit-venue-heading' data-testid="edit-venue-heading">
            <img 
                onClick={handleHeaderBackIconClick} 
                src={arrowIcon} 
                alt='arrow-icon' 
                className='edit-venue-icons' 
                data-testid="back-arrow-icon" 
            />
            <h1 data-testid="edit-venue-heading-text">Edit a Venue</h1>
        </article>
        <section className="edit-venue-container" data-testid="edit-venue-container">
            <form onSubmit={handleFormSubmit} data-testid="edit-venue-form">
                <article className="edit-venue-articles" data-testid="building-name-section">
                    <h2>Building:</h2>
                    <p data-testid="building-name">{previousPageDetails.BUILDING_NAME}</p>
                </article>
                <article className="edit-venue-articles" data-testid="venue-name-section">
                    <h2>Venue Name:</h2>
                    <input
                        type="text"
                        value={venueName || ""}
                        onChange={(e) => setVenueName(e.target.value)}
                        data-testid="venue-name-input"
                    />
                </article>
                <article className="edit-venue-articles" data-testid="capacity-section">
                    <h2>Capacity:</h2>
                    <input
                        type="number"
                        value={capacity || ""}
                        onChange={(e) => setCapacity(e.target.value)}
                        min="0" 
                        step="1" 
                        data-testid="capacity-input"
                    />
                </article>
                <article className="edit-venue-articles" data-testid="availability-section">
                    <h2>Availability:</h2>
                    <Switch
                        checked={isAvailable}
                        onChange={handleSwitchChange}
                        className="switch-wrapper"
                        offColor="#888"
                        onColor="#D4A843"
                        handleDiameter={20}
                        height={20}
                        width={48}
                        data-testid="availability-switch"
                    />
                </article>
                <article className="edit-venue-articles" data-testid="features-section">
                    <h2>Features:</h2>
                    <p></p>
                </article>
                <article className="edit-venue-checkboxes" data-testid="features-checkboxes">
                    {allFeatures.map((feature) => (
                        <article key={feature.FEATURE_ID} data-testid={`feature-${feature.FEATURE_ID}`}>
                            <label className="edit-venue-checkbox-label">
                                <input
                                    type="checkbox"
                                    className="edit-venue-checkbox-input"
                                    checked={features.includes(feature.FEATURE_ID)}
                                    onChange={() => handleFeatureToggle(feature.FEATURE_ID)}
                                    data-testid={`feature-checkbox-${feature.FEATURE_ID}`}
                                />
                                <span className="edit-venue-checkbox-custom"></span>
                                <span className="edit-venue-checkbox-text" data-testid={`feature-text-${feature.FEATURE_ID}`}>{feature.FEATURE_NAME}</span>
                            </label>
                        </article>
                    ))}
                </article>
                <article className="edit-venue-button-layout" data-testid="update-venue-button-layout">
                    <button onClick={handleFormSubmit} className="edit-venue-button" type="submit" data-testid="update-venue-button">Update Venue</button>
                </article>
            </form>
        </section>
        <Popup trigger={showPopup} onClose={handleClosePopup} data-testid="popup">
    {loading && (
        <article className='edit-venue-Popups' data-testid="loading-popup">
            <h2>Loading...</h2>
            <p>Please wait while we process your request.</p>
        </article>
    )}
    
    {/* Venue Name Error Popup */}
    {popupType === 'venueNameError' && !loading && (
        <article className='edit-venue-Popups' data-testid="venue-name-error-popup">
            <h2>Invalid Details</h2>
            <p>{message}</p>
            <button onClick={handleClosePopup} data-testid="venue-name-error-close-button">Close</button>
        </article>
    )}

    {/* Capacity Error Popup */}
    {popupType === 'capacityError' && !loading && (
        <article className='edit-venue-Popups' data-testid="capacity-error-popup">
            <h2>Invalid Details</h2>
            <p>{message}</p>
            <button onClick={handleClosePopup} data-testid="capacity-error-close-button">Close</button>
        </article>
    )}

    {/* Features Error Popup */}
    {popupType === 'featuresError' && !loading && (
        <article className='edit-venue-Popups' data-testid="features-error-popup">
            <h2>Features Error</h2>
            <p>{message}</p>
            <button onClick={handleClosePopup} data-testid="features-error-close-button">Close</button>
        </article>
    )}

    {/* No Changes Error Popup */}
    {popupType === 'noChangesError' && !loading && (
        <article className='edit-venue-Popups' data-testid="no-changes-error-popup">
            <h2>Invalid Details</h2>
            <p>{message}</p>
            <button onClick={handleClosePopup} data-testid="no-changes-error-close-button">Close</button>
        </article>
    )}

    {/* Confirmation Popup */}
    {popupType === 'confirmation' && !loading && (
        <article className='edit-venue-Popups' data-testid="confirmation-popup">
            <h2>Confirmation</h2>
            <p>Do you want to update this venue?</p>
            <article>
                <button onClick={handleUpdate} data-testid="confirmation-yes-button">Yes</button>
                <button onClick={handleClosePopup} data-testid="confirmation-no-button">No</button>
            </article>
        </article>
    )}

    {/* Success Popup */}
    {popupType === 'success' && !loading && (
        <article className='edit-venue-Popups' data-testid="success-popup">
            <h2>Success</h2>
            <p>The venue has been updated!</p>
            <button onClick={handleClosePopup} data-testid="success-close-button">Close</button>
        </article>
    )}
</Popup>
    </main>
    );
};

export default AdminEditVenuePage;
