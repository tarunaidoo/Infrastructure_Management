import "./AdminEditVenuePage.css";
import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import arrowIcon from '../../assets/icons/chevron-left.svg';
import { getBuilding, getVenue, getFeatures, getFeatureNames, updateVenue } from "../../services/AdminEditVenuePage/AdminEditVenuePage.service";
import Popup from "../../components/Popup/Popup";
const AdminEditVenuePage = () => {

    const [buildingName, setBuildingName] = useState("");
    const [buildingID, setBuildingID] = useState("");
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




    useEffect(() => {
        const fetchData = async () => {
            try {
                const buildingData = await getBuilding("Mathematical Science Labs");
                if (buildingData !== null) {
                    setBuildingName(buildingData.building_name);
                    setBuildingID(buildingData.building_id);
                }

                const venueData = await getVenue("MSL004");
                if (venueData) {
                    setVenueID(venueData.venue_id);
                    setVenueName(venueData.venue_name);
                    setCapacity(venueData.venue_capacity);
                    setIsAvailable(venueData.venue_status === "Available");
                    const venueFeatures = await getFeatures(venueData.venue_id);
                    if (venueFeatures) {
                        const roomFeatureIDData = venueFeatures.featureDetails.map(detail => detail.ROOM_FEATURE_ID);
                        const featureIds = venueFeatures.featureDetails.map(detail => detail.FEATURE_ID);
                        setroomFeatureIDs(roomFeatureIDData)
                        setFeatures(featureIds);
                    }
                }
                else {
                    setVenueName("Error");
                    setCapacity(-1);
                    setFeatures([]);
                }

                const featureNames = await getFeatureNames();
                featureNames ? setAllFeatures(featureNames) : setAllFeatures([]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

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
            handleUpdateVenueClick();
        }

    }

    const handleUpdate = (e) => {
        e.preventDefault();

        // Determine status based on isAvailable
        const updatedStatus = isAvailable ? "Available" : "Unavailable";

        // Log the values to ensure correctness
        console.log(isAvailable);
        console.log("Venue Status:", updatedStatus);

        // Prepare the data for updating the venue
        const updateVenueData = {
            VENUE_NAME: venueName,
            BUILDING_ID: buildingID,
            VENUE_CAPACITY: capacity,
            VENUE_STATUS: updatedStatus // Use the computed status
        };

        // Call the function to update the venue
        updateVenue(updateVenueData, venueID)
            .then(() => {
                console.log("Updated Venue Name:", venueName);
                console.log("Updated Capacity:", capacity);
                console.log("Venue Status:", updatedStatus);
                console.log("Selected Features:", features);
                console.log("Room Feature ID:", roomFeatureIDs);

                // Show success popup
                setPopupType('success');
                setShowPopup(true);
            })
            .catch((error) => {
                console.error("Error updating venue:", error);
                // Handle the error appropriately
            });
    };

    return (
        <main className="edit-venue-layout">
            <article className='edit-venue-heading'>

                <img src={arrowIcon} alt='arrow-icon' className='edit-venue-icons' />
                <h1>Edit a Venue</h1>

            </article>
            <section className="edit-venue-container">
                <form onSubmit={handleFormSubmit}>
                    <article className="edit-venue-inputs">
                        <h2>Building:</h2>
                        <p>{buildingName}</p>
                    </article>
                    <article className="edit-venue-inputs">
                        <h2>Venue Name:</h2>
                        <input
                            type="text"
                            value={venueName || ""}
                            onChange={(e) => setVenueName(e.target.value)}
                        />
                    </article>
                    <article className="edit-venue-inputs">
                        <h2>Capacity:</h2>
                        <input
                            type="number"
                            value={capacity || ""}
                            onChange={(e) => setCapacity(e.target.value)}
                            min="0" // Optional: Ensures only positive numbers or zero
                            step="1" // Optional: Sets increment steps to whole numbers
                        />
                    </article>
                    <article className="edit-venue-inputs">
                        <h2>Venue Status:</h2>
                        <Switch
                            checked={isAvailable}
                            onChange={handleSwitchChange}
                            offColor="#888"
                            onColor="#D4A843"
                            handleDiameter={20}
                            height={20}
                            width={48}
                        />
                    </article>
                    <article className="edit-venue-features-layout">
                        <h2>Features:</h2>
                        {allFeatures.map((feature) => (
                            <article key={feature.FEATURE_ID}>
                                <label>
                                    <input
                                        type="checkbox"
                                        className="edit-venue-checkbox-input"
                                        checked={features.includes(feature.FEATURE_ID)}
                                        onChange={() => handleFeatureToggle(feature.FEATURE_ID)}
                                    />
                                    <span className="edit-venue-checkbox-custom"></span>
                                    {feature.FEATURE_NAME}
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
                {popupType === 'error' && (
                    <article className='edit-venue-Popups'>
                        <h2>Invalid Details</h2>
                        <p>{message}</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </article>
                )}
                {popupType === 'confirmation' && (
                    <article className='edit-venue-Popups'>
                        <h2>Confirmation</h2>
                        <p>Do you want to update this venue?</p>
                        <article>
                            <button onClick={handleUpdate}>Yes</button>
                            <button onClick={handleClosePopup}>No</button>
                        </article>
                    </article>
                )}
                {popupType === 'success' && (
                    <article className='edit-venue-Popups'>
                        <h2>Confirmation</h2>
                        <p>The venue has been updated!</p>
                        <button onClick={handleClosePopup}>Close</button>
                    </article>
                )}
            </Popup>
        </main>
    );


};

export default AdminEditVenuePage;