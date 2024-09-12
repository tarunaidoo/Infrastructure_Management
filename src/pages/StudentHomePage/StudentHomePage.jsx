import React, { useState, useEffect } from 'react';
import Header from '../../components/HomePageHeader/StudentHomeHeader';
import Card from '../../components/HomePageCard/HomePageCard';
import Footer from '../../components/NavigationBar/StudentHomeFooter';
import Popup from '../../components/NotificationPopup/NotificationPopup';
import './StudentHomePage.css';
import { fetchBooking, fetchVenue, fetchBuilding } from "../../services/HomePages/HomePage.service";

function StudentHomePage() {
  const userID = localStorage.getItem('userEmail'); // get userID

  // State for bookings, venues, buildings, and loading/error handling
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [eventNames, setEventNames] = useState([]);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    // Check localStorage to see if the popup should be shown
    const shouldShowPopup = localStorage.getItem('showPopupOnStudentHome');
    
    if (shouldShowPopup === 'true') {
      setIsPopupOpen(true);
      localStorage.removeItem('showPopupOnStudentHome');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch bookings first
        const fetchedBookings = await fetchBooking(userID);
        setBookings(fetchedBookings);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter bookings to include only those happening today
        const todaysBookings = fetchedBookings.filter(booking => booking.DATE === today);

        // Collect event names into an array for today's events
        const namesArray = todaysBookings.map(booking => booking.EVENT_NAME);
        setEventNames(namesArray);

        // Fetch venues based on bookings
        const venuePromises = fetchedBookings.map(booking => fetchVenue(booking.VENUE_ID));
        const fetchedVenues = await Promise.all(venuePromises);
        setVenues(fetchedVenues);

        // Fetch buildings based on venues
        const buildingPromises = fetchedVenues.map(venue => fetchBuilding(venue?.BUILDING_ID));
        const fetchedBuildings = await Promise.all(buildingPromises);
        setBuildings(fetchedBuildings);

        console.log('User Bookings', fetchedBookings);
        console.log('Booking Venues', fetchedVenues);
        console.log('Venue Buildings', fetchedBuildings);

        setLoading(false); // Data has finished loading
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Failed to load data: ${error.message}`);
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchData();
  }, [userID]);

  if (loading) {
    return <div>Connecting...</div>; // Display 'Connecting...' while loading
  }

  if (error) {
    return <div>{error}</div>; // Display error message if there's an issue
  }

  return (
    <>
      {isPopupOpen && (
        <Popup arrayOfNames={eventNames} onClose={handleClosePopup} />
      )}
      <div className='home-body'>
        <Header />
        <section className='content'>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => {
              const venue = venues.find(v => v.VENUE_ID === booking.VENUE_ID);
              const building = buildings.find(b => b.BUILDING_ID === venue?.BUILDING_ID);

              return (
                <Card
                  key={index}
                  event={booking.EVENT_NAME}
                  date={booking.DATE}
                  time={`${booking.START_TIME} - ${booking.END_TIME}`}
                  venue={building?.BUILDING_NAME || 'Unknown Building'}
                  room={venue?.VENUE_NAME || 'Unknown Room'}
                />
              );
            })
          ) : (
            <div>No bookings found.</div>
          )}
        </section>
        <Footer />
      </div>
    </>
  );
}

export default StudentHomePage;
