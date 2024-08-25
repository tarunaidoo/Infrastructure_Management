import React, { useState } from "react";

import RoomCard from "../../components/RoomCard/RoomCard";
import BuildingCard from "../../components/BuildingCard/BuildingCard";
import Popup from "../../components/Popup/Popup";

import "./VenueSelectionPage.css";


const VenueSelectionPage = () => {
    // Variables

    // Function & Logic
    const handleInfoButtonClick = () => {
      setTrigger(true);
  }

    // HTML code
    return (
      <>
        <main className="centered-container">
          <section className="content-section">      
              <RoomCard roomName={"WSS001"}> 
                <img onClick={handleInfoButtonClick} className="circle-question-icon" src={circleQuestionIcon} alt="circle question mark icon"/>
              </RoomCard>
          </section>
        </main>
      </>
    );
}

export default VenueSelectionPage;
