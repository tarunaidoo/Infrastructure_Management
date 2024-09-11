import React from "react";
import {useNavigate, useLocation} from 'react-router-dom';

import Header from "../../components/NavigationHeader/NavigationHeader";
import CampusCard from "../../components/CampusCard/CampusCard";

import "./CampusSelectionPage.css";


const CampusSelectionPage = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const previousPageDetails = location.state || {};
    const campusNames = ["East Campus", "West Campus"];

    // Function & Logic
    const handleHeaderBackIconClick = () => {
        navigate(previousPageDetails.SOURCE_PAGE);
    }

    const handleCampusCardClick = ( campusName ) => {
        const currentPageDetails = {...previousPageDetails, CAMPUS_NAME: campusName};
        navigate("/building-selection", {state : currentPageDetails});
    }

    // HTML code
    return (
        <>
            <Header title={"Choose a Campus"} onClick={handleHeaderBackIconClick}/>
            <main className="centered-container">
                <section className="campus-selection-content-section">
                    {campusNames ?
                        campusNames.map((campusName) => (
                            <CampusCard key={campusName} campusName={campusName} onClick={() => handleCampusCardClick(campusName)}/>
                        ))
                    :""}
                </section>
            </main>
        </>
    );
}

export default CampusSelectionPage;
