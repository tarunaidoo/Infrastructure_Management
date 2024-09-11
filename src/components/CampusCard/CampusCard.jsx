import React from "react";

import "./CampusCard.css"


const CampusCard = ({campusName, onClick}) => {
    return (
        <section data-testid="campus-card" className="campus-card-container" onClick={onClick}>
            <p data-testid="campus-card-text"className="campus-name-text">{campusName}</p>
        </section>
    );
}

export default CampusCard;
