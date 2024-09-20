import React, { useState, useEffect } from 'react';
import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import Popup from '../../components/PopUpIssuesReported/PopUpIssuesReported';
import IssueListCard from '../../components/AdminListIssues/AdminListIssues';
import { fetchIssues, fetchVenues, updateAvailability, resolveIssues} from '../../services/IssuesReportedPage/IssuesReportedPage.service';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
function IssuesReportedPage() {
    const navigate = useNavigate();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [issues, setIssues] = useState([]);
    const [venues, setVenues] = useState([]);

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
    // const handleResolveIssue = async (issueID) => {
    // console.log("Resolving issue with ID:", issueID);
    // try {
    //     await resolveIssues(issueID, 'RESOLVED');
        
    //     setIssues(prevIssues => 
    //         prevIssues.map(issue =>
    //             issue.ISSUE_ID === issueID
    //             ? { ...issue, ISSUE_STATUS: 'RESOLVED', DATE_RESOLVED: new Date().toISOString() }
    //             : issue
    //         )
    //     );

    //     closePopup();
    // } catch (error) {
    //     console.error('Failed to resolve issue', error);
    // }
    // };

    const handleResolveIssue = async (issueID) => {
        console.log("Resolving issue with ID:", issueID);
        try {
            const response = await resolveIssues(issueID, 'RESOLVED');
            console.log('Resolve response:', response); // Test log
    
            setIssues(prevIssues => 
                prevIssues.map(issue =>
                    issue.ISSUE_ID === issueID
                    ? { ...issue, ISSUE_STATUS: 'RESOLVED', DATE_RESOLVED: new Date().toISOString() }
                    : issue
                )
            );
    
            closePopup();
        } catch (error) {
            console.error('Failed to resolve issue', error);
        }
    };
    
    
    const handleHeaderBackIconClick = () => {
        navigate("/admin-home");
    }

    return (
        <>
            <NavigationHeader title="Reports" onClick={handleHeaderBackIconClick} />

            <main className="issues-list">
                {issues.length > 0 ? (
                    issues.map(issue => (
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

            <Footer is="admin-report-footer"/>

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
