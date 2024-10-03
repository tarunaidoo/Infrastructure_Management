import React from "react";

import "./RoomCard.css"

import arrowDoorInIcon from "../../assets/icons/arrow-door-in.svg";

const RoomCard = ({roomName, onClick, children}) => {
    return (
        <section data-testid="room-card" className="room-card-container">
            <img data-testid="room-card-image" className="door-in-icon" src={arrowDoorInIcon} alt="arrow door in icon"/>
            <p data-testid="room-card-text" className="room-name-text" onClick={onClick} >{roomName}</p>
            {children}
        </section>
    );
}

export default RoomCard;
