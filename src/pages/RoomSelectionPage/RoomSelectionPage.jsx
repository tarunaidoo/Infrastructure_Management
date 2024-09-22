import React, { useState } from "react";
import {useNavigate, useLocation} from 'react-router-dom';
import { useQuery } from "react-query";

import Header from "../../components/NavigationHeader/NavigationHeader";
import RoomCard from "../../components/RoomCard/RoomCard";
import Popup from "../../components/Popup/Popup";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { getUserDetailsFromUserID, getVenuesFromBuildingIDAndUserID, getVenueFeatureNamesFromVenues } from "../../services/RoomSelectionPage/RoomSelectionPage.service";

import "./RoomSelectionPage.css";

import circleQuestionIcon from "../../assets/icons/circle-question.svg";


const RoomSelectionPage = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const previousPageDetails = location.state || {};

    const [selectedVenue, setSelectedVenue] = useState({});
    const [displayPopup, setDisplayPopup] = useState(false);

    // Function & Logic
    const { data : userDetails, error: userDetailsError, isLoading: userDetailsLoading } = useQuery(
        ["userDetailsData"], () => {
            return getUserDetailsFromUserID(previousPageDetails.USER_ID);
        }
    );

    const { data : venue, error: venueError, isLoading: venueLoading } = useQuery(
        ["roomData", previousPageDetails.BUILDING_ID, userDetails], async () => {
            const venues = await getVenuesFromBuildingIDAndUserID(previousPageDetails.BUILDING_ID, userDetails.USER_ROLE);
            return getVenueFeatureNamesFromVenues(venues);
        },
        {
            enabled: !!userDetails,
        }
    );

    const handleHeaderBackIconClick = () => {
        const backPageDetails = {
            SOURCE_PAGE: previousPageDetails.SOURCE_PAGE,
            USER_ID: previousPageDetails.USER_ID,
            DESTINATION_PAGE: previousPageDetails.DESTINATION_PAGE,
            CAMPUS_NAME: previousPageDetails.CAMPUS_NAME
        }
        navigate("/building-selection", {state : backPageDetails});
    }
    
    const handleQuestionIconClick = (venue) => {
        setSelectedVenue(venue);
        setDisplayPopup(true);
    }

    const handlePopupCloseButtonClick = () => {
        setDisplayPopup(false);
    }

    const handleRoomCardClick = (venue) => {
        const nextPageDetails = {
            ...previousPageDetails,
            VENUE_ID: venue.VENUE_ID,
            VENUE_NAME: venue.VENUE_NAME
        };

        navigate(previousPageDetails.DESTINATION_PAGE, {state : nextPageDetails});
    }
    // HTML code
    if (venueLoading || userDetailsLoading) {
        return (
            <>
                <Header title={"Choose a Room"} onClick={handleHeaderBackIconClick}/>
                <main className="room-selection-centered-container">
                    <LoadingComponent colour="#D4A843" size="15px" isLoading={venueLoading || userDetailsLoading}/>
                </main>
            </>
        );
    }

    if (userDetailsError) {
        return (
            <>
                <Header title={"Choose a Room"} onClick={handleHeaderBackIconClick}/>
                <main className="room-selection-centered-container">
                    <div>An error occurred: {userDetailsError.message}</div>
                </main>
            </>
        );
    }

    if (venueError) {
        return (
            <>
                <Header title={"Choose a Room"} onClick={handleHeaderBackIconClick}/>
                <main className="room-selection-centered-container">
                    <div>An error occurred: {venueError.message}</div>
                </main>
            </>
        );
    }

    return (
        <>
            <Header title={"Choose a Room"} onClick={handleHeaderBackIconClick}/>
            <main className="room-selection-centered-container">
                <section className="room-selection-content-section">
                    {venue ? 
                    venue.sort((a, b) => (a.VENUE_NAME < b.VENUE_NAME ? -1 : 1))
                    .map((venue) => (
                        <RoomCard key={venue.VENUE_ID} roomName={venue.VENUE_NAME} onClick={() => handleRoomCardClick(venue)}> 
                            {previousPageDetails.DESTINATION_PAGE === "/booking" ?
                                <img className="circle-question-icon" src={circleQuestionIcon} 
                                alt="circle question mark icon" onClick={() => handleQuestionIconClick(venue)}/>
                            : ""}
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
