import React from "react";

import './AdminEventsCard.css'
import bookmark from "../../assets/icons/bookmark-filled.svg";

function AdminEventsCard({onClick}){
    return(
        <main className="events-card" data-testid="AdminEventsCard-1" onClick={onClick} style={{ cursor: 'pointer' }}>
            <img src ={bookmark} alt="Bookmark-icon"/>
            <h2 className="card-title">Events Booked</h2>
        </main>
    );
}

export default AdminEventsCard;