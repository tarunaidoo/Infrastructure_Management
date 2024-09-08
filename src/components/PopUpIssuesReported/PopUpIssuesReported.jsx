import React from 'react';
import './PopUpIssuesReported.css';

function ReportedIssuePopup({ 
    issueID, 
    user, 
    reportDate, 
    resolvedDate, 
    venueName, 
    description, 
    status,
    onResolve, 
    onClose 
}) {
    return (
        <div className="popup-overlay" data-testid="popIssues-1">
            <div className="popup-content">
                <h2>Issue No: {issueID}</h2>
                <p><strong>Reported By:</strong> {user}</p>
                <p><strong>Report Date:</strong> {reportDate}</p>
                <p><strong>Resolved Date:</strong> {resolvedDate ? resolvedDate : 'Unresolved'}</p>
                <p><strong>Venue:</strong> {venueName}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Status:</strong> {status}</p>
                <button onClick={onResolve} className="resolved-button">Resolve</button>
                <button onClick={onClose} >Close</button>
            </div>
        </div>
    );
}

export default ReportedIssuePopup;
