import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminIssuesCard from '../../components/AdminIssuesCard/AdminIssuesCard'
import AdminEventsCard from '../../components/AdminEventsCard/AdminEventsCard';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import './AdminHomePage.css';
import AdminIcon from '../../assets/icons/admin-home-icon.svg';
import AdminNotification from '../../components/AdminNotification/AdminNotification';
import { fetchIssues, fetchVenues } from '../../services/IssuesReportedPage/IssuesReportedPage.service';
function AdminHomePage(){
    const userID = localStorage.getItem('userEmail'); // get userID
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [showNotification, setShowNotification] = useState(true); // Controls popup visibility
    
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
        setShowNotification(false); // Close the popup
      };

    // Fetch issues and venues
    useEffect(() => {
    const loadIssuesAndVenues = async () => {
      try {
        const issuesData = await fetchIssues(); // Fetch issues
        const venuesData = await fetchVenues(); // Fetch venues
  
        // Log the entire response objects
        console.log('Issues:', issuesData);
        console.log('Venues:', venuesData);
  
        // Validate that issuesData and venuesData are arrays
        if (!Array.isArray(issuesData)) {
          setError('issuesData is not an array or is undefined.');
          console.error('Error: issuesData is not an array or is undefined.');
          return;
        }
        if (!Array.isArray(venuesData)) {
          setError('venuesData is not an array or is undefined.');
          console.error('Error: venuesData is not an array or is undefined.');
          return;
        }
  
        // Extract arrays of issue titles and venue names
        const issuesArray = issuesData.map(issue => issue.TITLE);
        const venuesArray = issuesData.map(issue => {
          const correspondingVenue = venuesData.find(venue => venue.VENUE_ID === issue.VENUE_ID);
          return correspondingVenue ? correspondingVenue.VENUE_NAME : 'Unknown Venue';
        });
  
        setNotifications({ issuesArray, venuesArray }); // Store notifications
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
      }
    };
  
    loadIssuesAndVenues();
    }, []);

    return(
        <>
            <header className="adminheader">
                <section className="adminheaderBlock">
                    <img src={AdminIcon} alt="Admin Icon" id="adminIcon"></img>
                    <h1 id="admin-heading">Home</h1>
                </section>
            </header>
            <main className="admin-home-container">
            <AdminIssuesCard onClick={issuesCardClick} className="admin-home-cards"/>
            <AdminEventsCard onClick={eventsCardClick} className="admin-home-cards"/>
            </main>
            <Footer onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick}/>
            {/* Show notifications if available */}
        {showNotification && notifications.issuesArray && (
        <AdminNotification
          arrayOfIssues={notifications.issuesArray}
          arrayOfVenues={notifications.venuesArray}
          onClose={handleCloseNotification}
        />
      )}

      {/* Display error message if there's an error */}
      {error && <p className="error-message">{error}</p>}
        </>
        
        
    );
}

export default AdminHomePage;