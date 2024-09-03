import React from "react";
import './StudentUserCard.css'

function StudentUserCard({onClick}){
    return(
        <div className="student-card" data-testid="StudentCard-1" onClick={onClick} style={{ cursor: 'pointer' }}>
            <h2 className="card-title">Student Bookings</h2>
        </div>
    );
}

export default StudentUserCard;