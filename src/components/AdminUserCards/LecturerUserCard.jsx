import React from "react";
import './LecturerUserCard.css'

function LecturerUserCard({onClick}){
    return(
        <div className="lecturer-card" data-testid="LecturerCard-1" onClick={onClick} style={{ cursor: 'pointer' }}>
            <h2 className="card-title">Lecturer Bookings</h2>
        </div>
    );
}

export default LecturerUserCard;