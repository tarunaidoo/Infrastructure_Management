import React, { useState, useEffect } from 'react';
import Header from '../../components/HomePageHeader/StudentHomeHeader';
import Card from '../../components/HomePageCard/HomePageCard';
import Footer from '../../components/NavigationBar/StudentHomeFooter';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Popup from '../../components/NotificationPopup/NotificationPopup';
import './StudentHomePage.css';
import { fetchBooking, fetchVenue, fetchBuilding, fetchEventsBookings, fetchTutoringBookings } from "../../services/HomePages/HomePage.service";
import { useNavigate } from 'react-router-dom';

function StudentHomePage() {
  const userID = localStorage.getItem('userEmail'); // get userID

  // State for bookings, venues, buildings, and loading/error handling
  const [bookings, setBookings] = useState([]);
  const [eventBookings, setEventBookings] = useState([]);
  const [tutoringBookings, setTutoringBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [eventNames, setEventNames] = useState([]);
  const navigate = useNavigate();
  const [eventVenues, setEventVenues] = useState([]);


  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const shouldShowPopup = localStorage.getItem('showPopupOnStudentHome');
    if (shouldShowPopup === 'true') {
      setIsPopupOpen(true);
      localStorage.removeItem('showPopupOnStudentHome');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const date = new Date();
        const currentTime = date.toISOString().split('T')[1].slice(0, 8); // Get current time in 'HH:MM:SS' format
        const today = date.toISOString().split('T')[0];

        const fetchedBookings = await fetchBooking(userID);
        const filteredBookings = fetchedBookings.filter(booking => (booking.DATE > today) || (booking.DATE === today && booking.END_TIME >= currentTime));
        setBookings(filteredBookings);
  
        const fetchedEventBookings = await fetchEventsBookings(userID);
        const filteredEventBookings = fetchedEventBookings.filter(booking => (booking.DATE > today) || (booking.DATE === today && booking.END_TIME >= currentTime));
        setEventBookings(filteredEventBookings);
  
        const fetchedTutoringBookings = await fetchTutoringBookings(userID);
        const filteredTutoringBookings = fetchedTutoringBookings.filter(booking => (booking.DATE > today) || (booking.DATE === today && booking.END_TIME >= currentTime));
        setTutoringBookings(filteredTutoringBookings);
  
        const todaysBookings = filteredBookings.filter(booking => booking.DATE === today);
        const namesArray = todaysBookings.map(booking => booking.EVENT_NAME);
        setEventNames(namesArray);
  
        const venuePromises = fetchedBookings.map(booking => fetchVenue(booking.VENUE_ID));
        const fetchedVenues = await Promise.all(venuePromises);
        setVenues(fetchedVenues);
  
        // Set corresponding venues for today's bookings
        const venuesArray = todaysBookings.map(booking => {
          const venue = fetchedVenues.find(v => v.VENUE_ID === booking.VENUE_ID);
          return venue ? venue.VENUE_NAME : 'Unknown Venue';
        });
        setEventVenues(venuesArray);
  
        const buildingPromises = fetchedVenues.map(venue => fetchBuilding(venue?.BUILDING_ID));
        const fetchedBuildings = await Promise.all(buildingPromises);
        setBuildings(fetchedBuildings);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data: ${error.message}`);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userID]);

  const handleOnReportIssueClick = () => {
    const venueSelectionDetails = {
        SOURCE_PAGE: "/student-home",
        USER_ID: userID,
        DESTINATION_PAGE: "/report-issue"
    }
    navigate("/campus-selection", { state: venueSelectionDetails });
  }

  const handleOnBookVenueClick = () => {
    navigate("/booking");
  }

  const handleProfileClick=() =>{
    navigate("/profile");
  }

  if (loading) {
    return (
      <>
      <Header />
      <main className='centered-container'>
        <LoadingComponent colour="#D4A843" size="15" isLoading={loading}/> 
      </main>
      <Footer onBookVenueClick={handleOnBookVenueClick} onReportIssueClick={handleOnReportIssueClick}/>
      </>
    );
  }

  if (error) {
    return <main>{error}</main>;
  }

  const handleCardClick = (booking, venue, building) => {
    console.log('Navigating to event details with:', { booking, venue, building });
    navigate(`/event-details/${booking.EVENT_NAME}`, { state: { booking, venue, building } });
  };

  console.log(bookings);

  return (
    <>
      {isPopupOpen && (
        <Popup arrayOfNames={eventNames} onClose={handleClosePopup} arrayOfCorrespondingvenues={eventVenues}/>
      )}
      <main className='home-body'>
        <Header />
        <section className='home-content'>
          {bookings.length > 0  || eventBookings.length > 0 ? (
            [...bookings, ...eventBookings, ...tutoringBookings].map((booking, index) => {
              const venue = venues.find(v => v.VENUE_ID === booking.VENUE_ID);
              const building = buildings.find(b => b.BUILDING_ID === venue?.BUILDING_ID);
              
              return (
                <Card
                  key={index}
                  event={booking.EVENT_NAME || booking.TITLE}
                  date={booking.DATE}
                  time={`${booking.START_TIME} - ${booking.END_TIME}`}
                  venue={booking.BUILDING_NAME || building?.BUILDING_NAME || 'Unknown Building'} // [!!] Hack was done, should be done better
                  room={booking.VENUE_NAME || venue?.VENUE_NAME || 'Unknown Room'} // [!!] Hack was done, should be done better
                  onClick={() => handleCardClick(booking, venue, building)} // Pass onClick handler
                />
              );
            })
          ) : (
            <label className='no-content'>No bookings found.</label>
          )}
        </section>
        <Footer onBookVenueClick={handleOnBookVenueClick} onReportIssueClick={handleOnReportIssueClick} onProfileClick={handleProfileClick}/>
      </main>
    </>
  );
}

export default StudentHomePage;
