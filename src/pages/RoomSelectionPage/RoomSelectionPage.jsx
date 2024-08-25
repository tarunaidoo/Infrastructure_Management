import React from "react";

import Header from "../../components/NavigationHeader/NavigationHeader";
import RoomCard from "../../components/RoomCard/RoomCard";

import "./RoomSelectionPage.css";

import circleQuestionIcon from "../../assets/icons/circle-question.svg";


const RoomSelectionPage = () => {
    // Variables
    const rooms = [
        {"ROOM_ID": 0, "ROOM_NAME": "WSS001"},
        {"ROOM_ID": 1, "ROOM_NAME": "WSS002"},
        {"ROOM_ID": 2, "ROOM_NAME": "WSS003"}
    ]

    // Function & Logic

    // HTML code
    return (
        <>
            <Header title={"Choose a Room"}/>
            <main className="centered-container">
                <section className="content-section">
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
