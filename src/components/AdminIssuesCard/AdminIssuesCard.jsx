import React from "react";

import './AdminIssuesCard.css'

function AdminIssuesCard(onClick={}){
    return(
        <div className="issues-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <h2 className="card-title">Reported Issues</h2>
        </div>
    );
}

export default AdminIssuesCard;