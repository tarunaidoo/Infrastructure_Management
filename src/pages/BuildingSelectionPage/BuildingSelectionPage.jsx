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
    const previousPageDetails = location.state || {};

    // Fetch buildings and their tags
    const { data: buildings, error: buildingsError, isLoading: buildingsLoading } = useQuery(
        ["BuildingsData", previousPageDetails.CAMPUS_NAME], async () => {
            const buildings = await getBuildingsFromCampus(previousPageDetails.CAMPUS_NAME);
            return getBuildingTagNamesForBuildings(buildings);
        }
    );

    // Function & Logic
    const handleHeaderBackIconClick = () => {
        const backPageDetails = {
            SOURCE_PAGE: previousPageDetails.SOURCE_PAGE,
            USER_ID: previousPageDetails.USER_ID,
            DESTINATION_PAGE: previousPageDetails.DESTINATION_PAGE
        }
        navigate("/campus-selection", {state: backPageDetails});
    }
    
    const handleBuildingCardClick = ( building ) => {
        const nextPageDetails = {
            ...previousPageDetails,
            BUILDING_ID: building.BUILDING_ID,
            BUILDING_NAME: building.BUILDING_NAME,
        };

        navigate("/room-selection", { state : nextPageDetails});
    }

    // HTML code
    if (buildingsLoading) {
        return (
            <>
                <Header title={"Choose a Building"}/>
                <main className="centered-container">
                    <section>Fetching Buildings...</section>
                </main>
            </>
        );
    }

    if (buildingsError) {
        return (
            <>
                <Header title={"Choose a Building"}/>
                <main className="centered-container">
                    <section>An error occurred: {buildingsError.message}</section>
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
                buildings.sort((a, b) => (a.BUILDING_NAME < b.BUILDING_NAME ? -1 : 1))
                .map((building) => (
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
