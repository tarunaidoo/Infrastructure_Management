import React, { useState, useEffect } from 'react';
import Header from '../../components/HomePageHeader/StudentHomeHeader';
import Card from '../../components/HomePageCard/HomePageCard';
import Footer from '../../components/NavigationBar/StudentHomeFooter';
import Popup from '../../components/NotificationPopup/NotificationPopup';
import './StudentHomePage.css';
import { fetchBooking, fetchVenue, fetchBuilding } from "../../services/HomePages/HomePage.service";
import { useNavigate } from 'react-router-dom';

function StudentHomePage() {
  const userID = localStorage.getItem('userEmail');
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [eventNames, setEventNames] = useState([]);
  const navigate = useNavigate();

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
        const fetchedBookings = await fetchBooking(userID);
        setBookings(fetchedBookings);

        const today = new Date().toISOString().split('T')[0];
        const todaysBookings = fetchedBookings.filter(booking => booking.DATE === today);
        const namesArray = todaysBookings.map(booking => booking.EVENT_NAME);
        setEventNames(namesArray);

        const venuePromises = fetchedBookings.map(booking => fetchVenue(booking.VENUE_ID));
        const fetchedVenues = await Promise.all(venuePromises);
        setVenues(fetchedVenues);

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

  if (loading) {
    return <div>Connecting...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleCardClick = (booking, venue, building) => {
    console.log('Navigating to event details with:', { booking, venue, building });
    navigate(`/event-details/${booking.EVENT_NAME}`, { state: { booking, venue, building } });
  };

  return (
    <>
      {isPopupOpen && (
        <Popup arrayOfNames={eventNames} onClose={handleClosePopup} />
      )}
      <div className='home-body'>
        <Header />
        <section className='home-content'>
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
                  onClick={() => handleCardClick(booking, venue, building)} // Pass onClick handler
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
