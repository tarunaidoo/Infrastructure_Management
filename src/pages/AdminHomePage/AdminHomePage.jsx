import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminIssuesCard from '../../components/AdminIssuesCard/AdminIssuesCard'
import AdminEventsCard from '../../components/AdminEventsCard/AdminEventsCard';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import './AdminHomePage.css';
import AdminIcon from '../../assets/icons/admin-home-icon.svg';
import Popup from '../../components/AdminNotification/AdminNotification.jsx';
import {fetchIssues, fetchVenues} from '../../services/AdminHomePage/AdminHomePage.jsx';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';

function AdminHomePage(){
    const userID = localStorage.getItem('userEmail'); // get userID
    const navigate = useNavigate();

    // State for issues, venues, loading, and error handling
    const [issues, setIssues] = useState([]);
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Fetch issues and venues
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true); // Set loading to true before fetching
                const issuesData = await fetchIssues();
                const venuesData = await fetchVenues();
                // Filter issues based on your criteria (e.g., today’s issues)
                const date = new Date();
                const today = date.toISOString().split('T')[0];
                const filteredIssues = issuesData.filter(issue => issue.DATE === today); // Assuming DATE field exists

                setIssues(filteredIssues);
                setVenues(venuesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(`Failed to load data: ${error.message}`);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchData();
    }, []);

    // Show popup if there are new issues today
    useEffect(() => {
        const shouldShowPopup = localStorage.getItem('showPopupOnAdminHome');
        if (shouldShowPopup === 'true') {
            setIsPopupOpen(true);
            localStorage.removeItem('showPopupOnAdminHome');
        }
    }, []);

    // Close popup
    const closePopup = () => {
        setIsPopupOpen(false);
    };

    // Get venue name by ID
    const getVenueName = (venueID) => {
        const venue = venues.find(v => v.VENUE_ID === venueID);
        return venue ? venue.VENUE_NAME : 'Unknown Venue';
    };

    // Get array of issue titles and corresponding venues
    const issueTitles = issues.map(issue => issue.TITLE);
    const issueVenues = issues.map(issue => getVenueName(issue.VENUE_ID));
    
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

    if (loading) {
        return (
          <>
          <main className='centered-container'>
            <LoadingComponent colour="#D4A843" size="15" isLoading={loading}/> 
          </main>
          <Footer onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick}/>
          </>
        );
      }

    if (error) {
        return <main>{error}</main>;
    }

    return(
        <>
            {isPopupOpen && (
                <Popup 
                    arrayOfNames={issueTitles} 
                    arrayOfCorrespondingvenues={issueVenues} 
                    onClose={closePopup} 
                />
            )}
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
        </>
        
        
    );
}

export default AdminHomePage;
