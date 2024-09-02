import React from "react";

import "./BuildingTag.css"


const BuildingTag = ({tagName}) => {
    return (
        <div data-testid="building-tag" className="building-tag-container">
            <p data-testid="building-tag-text" className="tag-name-text">{tagName}</p>
        </div>
    );
}

export default BuildingTag;