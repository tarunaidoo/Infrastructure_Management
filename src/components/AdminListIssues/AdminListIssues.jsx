import React from 'react';
import './AdminListIssues.css';

function AdminListIssues({ venueName, isBlocked, onClick, onBlockRoom }) {
    return (
        <div className="issues-card" data-testid="admin-issues-card" onClick={onClick} style={{ cursor: 'pointer' }}>
            <h2 className="card-title" data-testid="card-title">{venueName}</h2>
            <button className="block-room-button" data-testid="block-room-button" onClick={(e) => {
                e.stopPropagation(); // Prevent the card click event from firing
                onBlockRoom(); // Call the handler to toggle status
            }}>
                {isBlocked ? 'Unblock' : 'Block'} {/* Toggle text based on the isBlocked prop */}
            </button>
        </div>
    );
}

export default AdminListIssues;
