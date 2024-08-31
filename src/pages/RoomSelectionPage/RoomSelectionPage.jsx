import React from "react";

import Header from "../../components/NavigationHeader/NavigationHeader";
import RoomCard from "../../components/RoomCard/RoomCard";

import "./RoomSelectionPage.css";

import circleQuestionIcon from "../../assets/icons/circle-question.svg";


const RoomSelectionPage = () => {
    // Variables
    const rooms = [
        {"ROOM_ID": 0, "ROOM_NAME": "MSL001"},
        {"ROOM_ID": 1, "ROOM_NAME": "MSL002"},
        {"ROOM_ID": 2, "ROOM_NAME": "MSL003"},
        {"ROOM_ID": 3, "ROOM_NAME": "MSL004"},
        {"ROOM_ID": 4, "ROOM_NAME": "MSL005"},
        {"ROOM_ID": 5, "ROOM_NAME": "MSL006"},
    ]

    // Function & Logic

    // HTML code
    return (
        <>
            <Header title={"Choose a Room"}/>
            <main className="centered-container">
                <section className="room-selection-content-section">
                    {rooms ? 
                    rooms.map((room) => (
                        <RoomCard key={room.ROOM_ID} roomName={room.ROOM_NAME}> 
                            <img className="circle-question-icon" src={circleQuestionIcon} alt="circle question mark icon"/>
                        </RoomCard>
                    ))
                    : "" }
                </section>
            </main>    
        </>
    );
}

export default RoomSelectionPage;
