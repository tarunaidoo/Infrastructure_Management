import React from "react";

import "./RoomCard.css"

import arrowDoorInIcon from "../../assets/icons/arrow-door-in.svg";
import circleQuestionIcon from "../../assets/icons/circle-question.svg";

const RoomCard = ({roomName, setTrigger}) => {
    
    const handleInfoButtonClick = () => {
        setTrigger(true);
    }
    
    return (
        <section className="room-card-container">
            <img className="door-in-icon" src={arrowDoorInIcon} alt="arrow door in icon"/>
            <p className="room-name-text"> {roomName} </p>
            <img onClick={handleInfoButtonClick} className="circle-question-icon" src={circleQuestionIcon} alt="circle question mark icon"/>
        </section>
    );
}

export default RoomCard;
