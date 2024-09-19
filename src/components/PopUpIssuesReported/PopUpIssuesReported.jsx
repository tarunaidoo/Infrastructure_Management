import React from 'react';
import './PopUpIssuesReported.css';

function ReportedIssuePopup({ 
    title, 
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
        <main className="popup-overlay" data-testid="popIssues-1">
            <section className="popup-content">
                <h2 data-testid="issueID">{title}</h2>
                <p data-testid="reportedBy"><strong>Reported By:</strong> {user}</p>
                <p data-testid="reportDate"><strong>Report Date:</strong> {reportDate}</p>
                <p data-testid="resolvedDate"><strong>Resolved Date:</strong> {resolvedDate ? resolvedDate : 'Unresolved'}</p>
                <p data-testid="venueName"><strong>Venue:</strong> {venueName}</p>
                <p data-testid="description"><strong>Description:</strong> {description}</p>
                <p data-testid="status"><strong>Status:</strong> {status}</p>
                <article className='issues-popup-buttons'>
                <button onClick={onResolve} data-testid="resolveButton"  className="resolved-button">Resolve</button>
                <button onClick={onClose} data-testid="closeButton">Close</button>
                </article>
            </section>
        </main>
    );
}

export default ReportedIssuePopup;
