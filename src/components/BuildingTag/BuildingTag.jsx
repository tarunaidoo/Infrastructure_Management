import React from "react";

import "./BuildingTag.css"


const BuildingTag = ({tagName}) => {
    return (
        <div className="building-tag-container">
            <p className="tag-name-text"> {tagName} </p>
        </div>
    );
}

export default BuildingTag;