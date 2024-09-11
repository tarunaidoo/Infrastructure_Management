import React from "react";
import { useQuery } from "react-query";
import {useNavigate, useLocation } from 'react-router-dom';

import Header from "../../components/NavigationHeader/NavigationHeader";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import { getBuildingsFromCampus, getBuildingTagNamesForBuildings } from "../../services/BuildingSelectionPage/BuildingSelectionPage.service";

import "./BuildingSelectionPage.css";


const BuildingSelectionPage = () => {
    // Variables
    const navigate = useNavigate();
    const location = useLocation();
    const campus = location.state || {};

    // Fetch buildings and their tags
    const { data: buildings, error: buildingsError, isLoading: buildingsLoading } = useQuery(
        ["BuildingsData", campus.CAMPUS_NAME], async () => {
            const buildings = await getBuildingsFromCampus(campus.CAMPUS_NAME);
            return getBuildingTagNamesForBuildings(buildings);
        }
    );

    // Function & Logic
    const handleHeaderBackIconClick = () => {
        navigate("/campus-selection");
    }
    
    const handleBuildingCardClick = ( building ) => {
        const selectedBuildingDetails = {
            ...campus,
            BUILDING_ID: building.BUILDING_ID,
            BUILDING_NAME: building.BUILDING_NAME,
        };

        navigate("/room-selection", { state : selectedBuildingDetails});
    }

    // HTML code
    if (buildingsLoading) {
        return (
            <>
                <Header title={"Choose a Building"}/>
                <main className="centered-container">
                    <div>Fetching Buildings...</div>
                </main>
            </>
        );
    }

    if (buildingsError) {
        return (
            <>
                <Header title={"Choose a Building"}/>
                <main className="centered-container">
                    <div>An error occurred: {buildingsError.message}</div>
                </main>
            </>
        );
    }

    return (
      <>
        <Header title={"Choose a Building"} onClick={handleHeaderBackIconClick}/>
        <main className="centered-container">
          <section className="building-selection-content-section">
            { buildings ?
                buildings.map((building) => (
                    <BuildingCard key={building.BUILDING_ID} 
                    buildingName={building.BUILDING_NAME} 
                    buildingTags={building.TAGS}
                    onClick={() => handleBuildingCardClick(building)}/>
                ))
            :""}
          </section>
        </main>
      </>
    );
}

export default BuildingSelectionPage;
