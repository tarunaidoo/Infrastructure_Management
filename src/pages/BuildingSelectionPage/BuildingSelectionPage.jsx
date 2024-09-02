import React, { useState } from "react";

import Header from "../../components/NavigationHeader/NavigationHeader";
import BuildingCard from "../../components/BuildingCard/BuildingCard";

import "./BuildingSelectionPage.css";


const BuildingSelectionPage = () => {
    // Variables
    const buildings = [
        {"BUILDING_ID": 0, "BUILDING_NAME": "Mathematical Science Labs", "TAGS": ["Computer Labs"]},
        {"BUILDING_ID": 1, "BUILDING_NAME": "Wits Science Stadium", "TAGS": ["Tutorial Rooms", "Lecture Halls"]},
        {"BUILDING_ID": 2, "BUILDING_NAME": "FNB Building", "TAGS": ["Computer Labs", "Tutorial Rooms", "Lecture Halls"]},
        {"BUILDING_ID": 3, "BUILDING_NAME": "...", "TAGS": ["...", "..."]},
        {"BUILDING_ID": 4, "BUILDING_NAME": "...", "TAGS": ["...", "..."]}
    ];
    // Function & Logic

    // HTML code
    return (
      <>
        <Header title={"Choose a Building"}/>
        <main className="centered-container">
          <section className="building-selection-content-section">
            { buildings ?
                buildings.map((building) => (
                    <BuildingCard key={building.BUILDING_ID} 
                    buildingName={building.BUILDING_NAME} buildingTags={building.TAGS}/>
                ))
            :""}
          </section>
        </main>
      </>
    );
}

export default BuildingSelectionPage;
