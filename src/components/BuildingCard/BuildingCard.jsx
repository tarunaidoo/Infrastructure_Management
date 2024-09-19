import React from "react";

import BuildingTag from "../BuildingTag/BuildingTag";

import "./BuildingCard.css";

import officeIcon from "../../assets/icons/office.svg";


const BuildingCard = ({buildingName, buildingTags, onClick}) => {
    return (
        <main data-testid="building-card" className="building-card-container" onClick={onClick}>
            <section className="heading-section">
                <img className="office-icon" src={officeIcon} alt="House icon"/>
                <p data-testid="building-card-text" className="building-name-text">{buildingName}</p>
            </section>

            <section className="tags-section">
                { buildingTags ?
                buildingTags.map((buildingTag) =>(
                    <BuildingTag key={buildingTag.TAG_ID} tagName={buildingTag.TAG_NAME}/>
                )) : ""}
            </section>
        </main>
    );
}

export default BuildingCard;
