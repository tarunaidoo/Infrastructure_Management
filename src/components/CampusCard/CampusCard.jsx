import React from "react";
import pointer from "../../assets/icons/crosshairs.svg"
import "./CampusCard.css"


const CampusCard = ({campusName, onClick}) => {
    return (
        <section data-testid="campus-card" className="campus-card-container" onClick={onClick}>
            <img src={pointer} alt="pointerIcon"/>
            <p data-testid="campus-card-text"className="campus-name-text">{campusName}</p>
        </section>
    );
}

export default CampusCard;
