import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import Popup from '../../components/PopUpIssuesReported/PopUpIssuesReported';
import IssueListCard from '../../components/AdminListIssues/AdminListIssues';
import { fetchIssues, fetchVenues, resolveIssues} from '../../services/IssuesReportedPage/IssuesReportedPage.service';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import './IssuesReportedPage.css';
function IssuesReportedPage() {
    const userID = localStorage.getItem('userEmail'); // get userID

    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issues, setIssues] = useState([]);
    const [venues, setVenues] = useState([]);
    const [filter, setFilter] = useState('all'); // State for filter type

    useEffect(() => {
        const fetchData = async () => {
            const issuesData = await fetchIssues();
            const venuesData = await fetchVenues();
            setIssues(issuesData);
            setVenues(venuesData);
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

    const filteredIssues = () => {
        if (filter === 'resolved') {
            return issues.filter(issue => issue.ISSUE_STATUS === 'RESOLVED');
        }
        if (filter === 'unresolved') {
            return issues.filter(issue => issue.ISSUE_STATUS !== 'RESOLVED');
        }
        return issues; // 'all' or any other value
    };

    return (
        <>
            <NavigationHeader title="Reports" onClick={handleHeaderBackIconClick} />
            <div className="issue-filters">
                <button className="issues-filter-btn" onClick={() => setFilter('all')}>All Issues</button>
                <button className="issues-filter-btn" onClick={() => setFilter('resolved')}>Resolved Issues</button>
                <button className="issues-filter-btn" onClick={() => setFilter('unresolved')}>Unresolved Issues</button>
            </div>
            <main className="issues-list">
                {filteredIssues().length > 0 ? (
                    filteredIssues().map(issue => (
                        <IssueListCard
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
