import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import Header from '../../components/NavigationHeader/NavigationHeader';
import Popup from '../../components/PopUpIssuesReported/PopUpIssuesReported';
import IssueListCard from '../../components/AdminListIssues/AdminListIssues';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { fetchIssues, fetchVenues, resolveIssues} from '../../services/IssuesReportedPage/IssuesReportedPage.service';

import './IssuesReportedPage.css';


function IssuesReportedPage() {
    const userID = localStorage.getItem('userEmail'); // get userID

    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issues, setIssues] = useState([]);
    const [venues, setVenues] = useState([]);
    const [filter, setFilter] = useState('all'); // State for filter type
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVenue, setSelectedVenue] = useState(''); // State for selected venue

    useEffect(() => {
        const fetchData = async () => {
            try {
                const issuesData = await fetchIssues();
                const venuesData = await fetchVenues();
                setIssues(issuesData);
                setVenues(venuesData);
                setLoading(false);
            }
            catch ( error ) {
                console.error('Error fetching data:', error);
                setError(`Failed to load data: ${error.message}`);
                setLoading(false);
            }
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

    //resolved issue
    const handleResolveIssue = async (issueID) => {
        try {
            await resolveIssues(issueID, 'RESOLVED');
            setIssues(prevIssues => {
                const updatedIssues = prevIssues.map(issue =>
                    issue.ISSUE_ID === issueID
                        ? { ...issue, ISSUE_STATUS: 'RESOLVED', DATE_RESOLVED: new Date().toISOString() }
                        : issue
                );

                // Sort issues: keep unresolved at the top
                return updatedIssues.sort((a, b) => {
                    if (a.ISSUE_STATUS === 'RESOLVED' && b.ISSUE_STATUS !== 'RESOLVED') return 1;
                    if (a.ISSUE_STATUS !== 'RESOLVED' && b.ISSUE_STATUS === 'RESOLVED') return -1;
                    return 0;
                });
            });

            closePopup();
        } catch (error) {
            console.error('Failed to resolve issue', error);
        }
    };

    const handleHeaderBackIconClick = () => {
        navigate("/admin-home");
    };
    const handleHomeClick = () => {
        navigate("/admin-home");
    };
    const handleAddVenueClick = () => {
        navigate('/admin-add-venue');
    };

    const handleEditVenueClick = () =>{
        const venueSelectionDetails = {
            SOURCE_PAGE: "/admin-home",
            USER_ID: userID,
            DESTINATION_PAGE: "/edit-venue"
        }
        navigate("/campus-selection", { state: venueSelectionDetails });
    };

    const handleProfileClick = () =>{
        navigate('/profile');
    };
    //filter issues based on selected venue and filter type
    const filteredIssues = () => {
        let filtered = issues;

        // If a venue is selected, filter issues based on that venue
        if (selectedVenue) {
            //console.log('Filtering for venue:', selectedVenue, 'Type:', typeof selectedVenue);
            filtered = filtered.filter(issue => {
                const venueId = issue.VENUE_ID; // This is a number
                //console.log('Comparing issue venue:', venueId, 'Type:', typeof venueId);
                return venueId === Number(selectedVenue); // Convert selectedVenue to a number for comparison
            });
        }
        if (filter === 'resolved') {
            return filtered.filter(issue => issue.ISSUE_STATUS === 'RESOLVED');
        }
        if (filter === 'unresolved') {
            return filtered.filter(issue => issue.ISSUE_STATUS !== 'RESOLVED');
        }
        return filtered; // 'all' or any other value
    };

    if (loading) {
        return (
            <>
                <Header title="Reports" onClick={handleHeaderBackIconClick} />
                <main className="issues-reported-centered-container">
                    <LoadingComponent colour="#D4A843" size="15px" isLoading={loading}/>
                </main>
                <Footer id="admin-report-footer" onHomeClick={handleHomeClick} onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick} />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header title="Reports" onClick={handleHeaderBackIconClick} />
                <main className="issues-reported-centered-container">
                    <div>{error}</div>
                </main>
                <Footer id="admin-report-footer" onHomeClick={handleHomeClick} onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick} />
            </>
        );
    }

    return (
        <>
            <Header className="ReportTitle" title="Reports" onClick={handleHeaderBackIconClick} />
            {/* Venue Dropdown */}
            <div className="venue-filter">
                <select 
                    id="venue-select" 
                    value={selectedVenue} 
                    onChange={(e) => setSelectedVenue(e.target.value)}
                >
                    <option value="">All Venues</option>
                    {venues.map(venue => (
                        <option key={venue.VENUE_ID} value={venue.VENUE_ID}>
                            {venue.VENUE_NAME}
                        </option>
                    ))}
                </select>
            </div>
            {/* Filter type all, resolved, unresolved Dropdown */}
            <div className="venue-filter">
                <select 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All Issues</option>
                    <option value="resolved">Resolved Issues</option>
                    <option value="unresolved">Unresolved Issues</option>
                </select>
            </div>
            
            <main className="issues-list">
                {filteredIssues().length > 0 ? (
                    filteredIssues().map(issue => (
                        <IssueListCard
                            className="issues-card-comp"
                            key={issue.ISSUE_ID}
                            title={issue.TITLE}
                            reportedBy={issue.REPORTED_BY}
                            date={formatDate(issue.REPORT_DATE)}
                            venueName={getVenueName(issue.VENUE_ID)}  // Pass the venue name
                            onClick={() => openPopup(issue)}
                        />
                    ))
                ) : (
                    <p>No issues found.</p>
                )}
            </main>

            <Footer id="admin-report-footer" onHomeClick={handleHomeClick} onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick} />


            {isPopupOpen && selectedIssue && (
                <Popup
                    title={selectedIssue.TITLE}
                    user={selectedIssue.REPORTED_BY}
                    reportDate={formatDate(selectedIssue.REPORT_DATE)}
                    resolvedDate={selectedIssue.DATE_RESOLVED ? formatDate(selectedIssue.DATE_RESOLVED) : 'Not Resolved'}
                    venueName={getVenueName(selectedIssue.VENUE_ID)}
                    description={selectedIssue.DESCRIPTION}
                    status={selectedIssue.ISSUE_STATUS}
                    onResolve={()=>handleResolveIssue(selectedIssue.ISSUE_ID)}
                    onClose={closePopup}
                />
            )}
        </>
    );
}

export default IssuesReportedPage;
