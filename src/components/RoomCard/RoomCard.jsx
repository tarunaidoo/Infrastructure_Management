import React from "react";

import "./RoomCard.css"

import arrowDoorInIcon from "../../assets/icons/arrow-door-in.svg";

const RoomCard = ({roomName, children}) => {
    return (
        <section className="room-card-container">
            <img className="door-in-icon" src={arrowDoorInIcon} alt="arrow door in icon"/>
            <p className="room-name-text"> {roomName} </p>
            {children}
        </section>
    );
}

export default RoomCard;
