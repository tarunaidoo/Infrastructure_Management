import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminIssuesCard from '../../components/AdminIssuesCard/AdminIssuesCard'
import AdminEventsCard from '../../components/AdminEventsCard/AdminEventsCard';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import './AdminHomePage.css';
import AdminIcon from '../../assets/icons/admin-home-icon.svg';
import AdminNotification from '../../components/AdminNotification/AdminNotification';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import { fetchIssues, fetchVenues } from '../../services/IssuesReportedPage/IssuesReportedPage.service';

function AdminHomePage(){
    const userID = localStorage.getItem('userEmail'); // get userID
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const [showNotification, setShowNotification] = useState(true); // Controls popup visibility
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    
    const eventsCardClick = () =>{
        navigate('/admin-view-booking'); //move from this page to Events page
    };

    const issuesCardClick = () =>{
        navigate('/admin-issues-reported'); //move from this page to Issues page
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

    const handleCloseNotification = () => {
        setIsPopupOpen(false); // Close the popup
      };

    // Only show popup on the first visit after login
    useEffect(() => {
      const shouldShowPopup = localStorage.getItem('showPopupOnAdminHome');
      if (shouldShowPopup === 'true') {
        setIsPopupOpen(true);
        localStorage.removeItem('showPopupOnAdminHome');
      }
    }, []);
    useEffect(() => {
        const loadIssuesAndVenues = async () => {
          try {
            const issuesData = await fetchIssues(); // Fetch issues
            const venuesData = await fetchVenues(); // Fetch venues
    
            if (!Array.isArray(issuesData) || !Array.isArray(venuesData)) {
              setError('Invalid data format.');
              return;
            }
    
            const today = new Date().toISOString().split('T')[0];
    
            // Filter issues by REPORT_DATE & ISSUE_STATUS
            const filteredIssues = issuesData.filter(issue =>
              issue.REPORT_DATE &&
              issue.REPORT_DATE.split('T')[0] === today &&
              issue.ISSUE_STATUS === 'UNRESOLVED'
            );
    
            const issuesArray = filteredIssues.map(issue => issue.TITLE);
            const venuesArray = filteredIssues.map(issue => {
              const correspondingVenue = venuesData.find(venue => venue.VENUE_ID === issue.VENUE_ID);
              return correspondingVenue ? correspondingVenue.VENUE_NAME : 'Unknown Venue';
            });
    
            setNotifications({ issuesArray, venuesArray });
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data.');
            setLoading(false);
          }
        };
    
        loadIssuesAndVenues();
      }, []);

    if (loading) {
        return (
          <>
          <header className="adminheader">
                <section className="adminheaderBlock">
                    <img src={AdminIcon} alt="Admin Icon" id="adminIcon" />
                    <h1 id="admin-heading">Home</h1>
                </section>
            </header>
          <main className='centered-container'>
            <LoadingComponent colour="#D4A843" size="15" isLoading={loading} />
          </main>
          <Footer onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick} />
          </>
        );
    }

    if (error) {
        return <main>{error}</main>;
    }

    return(
        <>
            <header className="adminheader">
                <section className="adminheaderBlock">
                    <img src={AdminIcon} alt="Admin Icon" id="adminIcon"></img>
                    <h1 id="admin-heading">Home</h1>
                </section>
            </header>
            {isPopupOpen && notifications.issuesArray && (
            <AdminNotification
                arrayOfIssues={notifications.issuesArray}
                arrayOfVenues={notifications.venuesArray}
                onClose={handleCloseNotification}
            />
            )}
            <main className="admin-home-container">
            <AdminIssuesCard onClick={issuesCardClick} className="admin-home-cards" data-testid="issues-card"/>
            <AdminEventsCard onClick={eventsCardClick} className="admin-home-cards" data_testid="events-card"/>
            </main>
            <Footer onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick}/>
            {/* Show notifications if available */}
        

      {/* Display error message if there's an error */}
      {error && <p className="error-message">{error}</p>}
        </>
        
        
    );
}

export default AdminHomePage;