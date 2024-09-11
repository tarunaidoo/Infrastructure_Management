import React, { useState } from "react";
import {useNavigate, useLocation} from 'react-router-dom';
import { useQuery } from "react-query";

import Header from "../../components/NavigationHeader/NavigationHeader";
import RoomCard from "../../components/RoomCard/RoomCard";
import Popup from "../../components/Popup/Popup";
import { getVenuesFromBuildingID, getVenueFeatureNamesFromVenues } from "../../services/RoomSelectionPage/RoomSelectionPage.service";

import "./RoomSelectionPage.css";

import circleQuestionIcon from "../../assets/icons/circle-question.svg";


const RoomSelectionPage = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const buildingDetails = location.state || {};

    const [selectedVenue, setSelectedVenue] = useState({});
    const [displayPopup, setDisplayPopup] = useState(false);

    // Function & Logic
    const { data : venue, error: venueError, isLoading: venueLoading} = useQuery(
        ["roomData", buildingDetails.BUILDING_ID], async () => {
            const venues = await getVenuesFromBuildingID(buildingDetails.BUILDING_ID);
            return getVenueFeatureNamesFromVenues(venues);
    });

    const handleHeaderBackIconClick = () => {
        const campusDetails = {
            CAMPUS_NAME: buildingDetails.CAMPUS_NAME
        }
        navigate("/building-selection", {state : campusDetails});
    }
    
    const handleQuestionIconClick = (venue) => {
        setSelectedVenue(venue);
        setDisplayPopup(true);
    }

    const handlePopupCloseButtonClick = () => {
        setDisplayPopup(false);
    }

    const handleRoomCardClick = (venue) => {
        const bookingInfo = {
            ...buildingDetails,
            VENUE_ID: venue.VENUE_ID,
            VENUE_NAME: venue.VENUE_NAME
        };

        navigate("/booking", {state : bookingInfo});
    }

    // HTML code
    if (venueLoading) {
        return (
            <>
                <Header title={"Choose a Room"}/>
                <main className="centered-container">
                    <div>Fetching Rooms...</div>
                </main>
            </>
        );
    }

    if (venueError) {
        return (
            <>
                <Header title={"Choose a Room"}/>
                <main className="centered-container">
                    <div>An error occurred: {venueError.message}</div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header title={"Choose a Room"} onClick={handleHeaderBackIconClick}/>
            <main className="centered-container">
                <section className="room-selection-content-section">
                    {venue ? 
                    venue.map((venue) => (
                        <RoomCard key={venue.VENUE_ID} roomName={venue.VENUE_NAME} onClick={() => handleRoomCardClick(venue)}> 
                            <img className="circle-question-icon" src={circleQuestionIcon} 
                                alt="circle question mark icon" onClick={() => handleQuestionIconClick(venue)}/>
                        </RoomCard>
                    ))
                    : "" }
                </section>
            </main>

            {displayPopup ? 
                <Popup trigger={displayPopup}>
                    <h1> {selectedVenue.VENUE_NAME} </h1>
                    <article className="features-container">
                        <p className="features-text">Room Features:</p>
                        <ul className="features-list">
                            {
                                selectedVenue.FEATURES.map((feature) => (
                                    <li key={feature.FEATURE_ID}> {feature.FEATURE_NAME} </li>
                                ))
                            }
                        </ul>
                    </article>
                    <button className="features-popup-button" onClick={handlePopupCloseButtonClick}>Close</button>
                </Popup> 
            : ""}  
        </>
    );
}

export default RoomSelectionPage;
