import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import Popup from '../../components/PopUpIssuesReported/PopUpIssuesReported';
import './IssuesReportedPage.css';
import IssueListCard from '../../components/AdminListIssues/AdminListIssues';
import { fetchIssues, fetchVenues, updateAvailability } from '../../services/IssuesReportedPage/IssuesReportedPage.service';

function IssuesReportedPage() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issues, setIssues] = useState([]);
    const [venues, setVenues] = useState([]);
    const [blockedVenues, setBlockedVenues] = useState(new Set()); // Track blocked venues

    useEffect(() => {
        const fetchData = async () => {
            const issuesData = await fetchIssues();
            const venuesData = await fetchVenues();
            setIssues(issuesData);
            setVenues(venuesData);

            // Initialize blocked venues set
            const blocked = new Set(venuesData.filter(v => v.AVAILABILITY === 'Unavailable').map(v => v.VENUE_ID));
            setBlockedVenues(blocked);
        };

        fetchData();
    }, []);

    const openPopup = (issue) => {
        setSelectedIssue(issue);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const getVenueName = (venueID) => {
        const venue = venues.find(v => v.VENUE_ID === venueID);
        return venue ? venue.VENUE_NAME : 'Unknown Venue';
    };

    // Toggle room availability and update state
    const handleBlockRoom = async (venueID) => {
        try {
            // Determine current status by checking if the venue is blocked
            const isBlocked = blockedVenues.has(venueID);
            const newStatus = isBlocked ? 'Available' : 'Unavailable';

            //fetch name of venueID
            //const venueName = getVenueName(venueID);

            // Update venue status in the database
            await updateAvailability(venueID, newStatus);

            // Update local state
            setBlockedVenues(prev => {
                const newBlockedVenues = new Set(prev);
                if (newStatus === 'Unavailable') {
                    newBlockedVenues.add(venueID);
                } else {
                    newBlockedVenues.delete(venueID);
                }
                return newBlockedVenues;
            });
        } catch (error) {
            console.error('Failed to update venue availability', error);
        }
    };

    return (
        <>
            <NavigationHeader title="Reports" />

            <div className="issues-list">
                {issues.length > 0 ? (
                    issues.map(issue => (
                        <IssueListCard
                            key={issue.ISSUE_ID}
                            title={issue.TITLE}
                            venueName={getVenueName(issue.VENUE_ID)}  // Pass the venue name
                            isBlocked={blockedVenues.has(issue.VENUE_ID)}  // Determine if venue is blocked
                            onClick={() => openPopup(issue)}
                            onBlockRoom={() => handleBlockRoom(issue.VENUE_ID)} // Pass venue ID to handler
                        />
                    ))
                ) : (
                    <p>No issues found.</p>
                )}
            </div>

            {isPopupOpen && selectedIssue && (
                <Popup
                    title={selectedIssue.TITLE}
                    user={selectedIssue.REPORTED_BY}
                    reportDate={formatDate(selectedIssue.REPORT_DATE)}
                    resolvedDate={selectedIssue.DATE_RESOLVED ? formatDate(selectedIssue.DATE_RESOLVED) : 'Not Resolved'}
                    venueName={getVenueName(selectedIssue.VENUE_ID)}
                    description={selectedIssue.DESCRIPTION}
                    status={selectedIssue.ISSUE_STATUS}
                    onClose={closePopup}
                />
            )}
        </>
    );
}

export default IssuesReportedPage;
