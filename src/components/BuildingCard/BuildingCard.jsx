import React from "react";

import BuildingTag from "../BuildingTag/BuildingTag";

import "./BuildingCard.css";

import officeIcon from "../../assets/icons/office.svg";


const BuildingCard = ({buildingName, buildingTags}) => {
    return (
        <section className="building-card-container">
            <div className="heading-section">
                <img className="office-icon" src={officeIcon} alt="House icon"/>
                <p className="building-name-text">{buildingName}</p>
            </div>

            <div className="tags-section">
                { buildingTags ?
                buildingTags.map((buildingTag) =>(
                    <BuildingTag key={buildingTag.NAME} tagName={buildingTag.NAME}/>
                )) : ""}
            </div>
        </section>
    );
}

export default BuildingCard;
