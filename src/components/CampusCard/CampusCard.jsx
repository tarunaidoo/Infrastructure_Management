import React from "react";

import "./CampusCard.css"


const CampusCard = ({campusName}) => {
    return (
        <section className="campus-card-container">
            <p className="campus-name-text"> {campusName} </p>
        </section>
    );
}

export default CampusCard;
