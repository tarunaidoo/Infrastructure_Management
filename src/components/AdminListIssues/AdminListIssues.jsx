import React from 'react';
import './AdminListIssues.css';
import InfoIcon from '../../assets/icons/circle-info.svg';

function AdminListIssues({ title, venueName, date, onClick }) {
    return (
        <main className="issues-card-container">
        <section className="issues-list-card" data-testid="admin-issues-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <h2 className="card-title" data-testid="card-title"><b>{title}</b></h2>
            <section className="issue-card-details">
                <p><strong>Venue:</strong> {venueName}</p>
                <p><strong>Date Reported:</strong> {date}</p>
            </section>
            <img src={InfoIcon} alt="Info" className="admin-issues-info-icon" />
        </section>
        </main>
        
    );
}

export default AdminListIssues;
