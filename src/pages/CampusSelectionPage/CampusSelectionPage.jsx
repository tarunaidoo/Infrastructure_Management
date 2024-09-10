import React from "react";
import {useNavigate} from 'react-router-dom';

import Header from "../../components/NavigationHeader/NavigationHeader";
import CampusCard from "../../components/CampusCard/CampusCard";

import "./CampusSelectionPage.css";


const CampusSelectionPage = () => {
    // Variables
    const navigate = useNavigate();
    const campusNames = ["East Campus", "West Campus"];

    // Function & Logic
    const handleHeaderBackIconClick = () => {
        navigate("/booking");
    }

    const handleCampusCardClick = ( campusName ) => {
        const campusDetails = {CAMPUS_NAME: campusName}
        navigate("/building-selection", {state : campusDetails});
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
