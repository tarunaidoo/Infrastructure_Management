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
    const [validInfo, setValidInfo] = useState(true);
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

        if (!venueName) {
            setPopupType('error');
            setShowPopup(true);
            setMessage("Please fill in a valid venue name.");
            setValidInfo(false);
            return;
        }
        if (!capacity || isNaN(capacity) || capacity <= 0) {
            setPopupType('error');
            setShowPopup(true);
            setValidInfo(false);
            setMessage("Please fill in a valid capacity.");
            return;
        }

        if (validInfo) {
            // Check if there are any updates
            if (
                venueName === initialValues.venueName &&
                capacity === initialValues.capacity &&
                isAvailable === initialValues.isAvailable &&
                features.length === initialValues.features.length &&
                features.every(id => initialValues.features.includes(id))
            ) {
                setPopupType('error');
                setMessage("No changes have been made.");
                setShowPopup(true);
                return;
            }

            handleUpdateVenueClick();
        }
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
            window.location.reload();

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
        <main className="edit-venue-layout">
            <article className='edit-venue-heading'>
                <img onClick={handleHeaderBackIconClick} src={arrowIcon} alt='arrow-icon' className='edit-venue-icons' />
                <h1>Edit a Venue</h1>
            </article>
            <section className="edit-venue-container">
                <form onSubmit={handleFormSubmit}>
                    <article className="edit-venue-articles" >
                        <h2>Building:</h2>
                        <p>{previousPageDetails.BUILDING_NAME}</p>
                    </article>
                    <article className="edit-venue-articles" >
                        <h2>Venue Name:</h2>
                        <input
                            type="text"
                            value={venueName || ""}
                            onChange={(e) => setVenueName(e.target.value)}
                        />
                    </article>
                    <article className="edit-venue-articles">
                        <h2>Capacity:</h2>
                        <input
                            type="number"
                            value={capacity || ""}
                            onChange={(e) => setCapacity(e.target.value)}
                            min="0" 
                            step="1" 
                        />
                    </article>
                    <article className="edit-venue-articles" >
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
                        />
                    </article>
                    <article className="edit-venue-articles">
                        <h2>Features:</h2>
                        <p></p>
                        </article>
                        <article className="edit-venue-checkboxes">
                        {allFeatures.map((feature) => (
                           <article key={feature.FEATURE_ID}>
                           <label className="edit-venue-checkbox-label">
                             <input
                               type="checkbox"
                               className="edit-venue-checkbox-input"
                               checked={features.includes(feature.FEATURE_ID)}
                               onChange={() => handleFeatureToggle(feature.FEATURE_ID)}
                             />
                             <span className="edit-venue-checkbox-custom"></span>
                             <span className="edit-venue-checkbox-text">{feature.FEATURE_NAME}</span>
                           </label>
                         </article>
                        ))}
                        </article>
                    <article className="edit-venue-button-layout">
                        <button className="edit-venue-button" type="submit" >Update Venue</button>
                    </article>
                </form>
            </section>
            <Popup trigger={showPopup} onClose={handleClosePopup}>
                {loading && (
                    <article className='edit-venue-Popups'>
                        <h2>Loading...</h2>
                        <p>Please wait while we process your request.</p>
                    </article>
                )}
                {popupType === 'error' && !loading && (
                    <article className='edit-venue-Popups'>
                        <h2>Error</h2>
                        <p>{message}</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </article>
                )}
                {popupType === 'confirmation' && !loading && (
                    <article className='edit-venue-Popups'>
                        <h2>Confirmation</h2>
                        <p>Do you want to update this venue?</p>
                        <article>
                            <button onClick={handleUpdate}>Yes</button>
                            <button onClick={handleClosePopup}>No</button>
                        </article>
                    </article>
                )}
                {popupType === 'success' && !loading && (
                    <article className='edit-venue-Popups'>
                        <h2>Success</h2>
                        <p>The venue has been updated!</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </article>
                )}
            </Popup>
        </main>
    );
};

export default AdminEditVenuePage;
