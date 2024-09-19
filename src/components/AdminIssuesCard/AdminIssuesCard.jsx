import React from "react";
import reportIcon from "../../assets/icons/triangle-warning-filled.svg"
import './AdminIssuesCard.css'

function AdminIssuesCard({onClick}){
    return(
        <main className="issues-card" data-testid="AdminIssuesCard-1" onClick={onClick} style={{ cursor: 'pointer' }}>
            <img src ={reportIcon} alt="report-icon"/>
            <h2 className="card-title">Reported Issues</h2>
        </main>
    );
}

export default AdminIssuesCard;