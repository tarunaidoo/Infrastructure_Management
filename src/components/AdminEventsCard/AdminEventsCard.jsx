import React from "react";

import './AdminEventsCard.css'

function AdminEventsCard({onClick}){
    return(
        <div className="events-card" data-testid="AdminEventsCard-1" onClick={onClick} style={{ cursor: 'pointer' }}>
            <h2 className="card-title">Events Booked</h2>
        </div>
    );
}

export default AdminEventsCard;