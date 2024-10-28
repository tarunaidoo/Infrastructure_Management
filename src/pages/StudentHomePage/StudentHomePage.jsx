import React, { useState, useEffect } from 'react';
import Header from '../../components/HomePageHeader/StudentHomeHeader';
import Card from '../../components/HomePageCard/HomePageCard';
import Footer from '../../components/NavigationBar/StudentHomeFooter';
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Popup from '../../components/NotificationPopup/NotificationPopup';
import './StudentHomePage.css';
import { fetchBooking, fetchVenue, fetchBuilding } from "../../services/HomePages/HomePage.service";
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';


function StudentHomePage() {
  const userID = localStorage.getItem('userEmail'); // get userID

  // Date Time information
  const date = new Date();
  const currentTime = date.toISOString().split('T')[1].slice(0, 8); // Get current time in 'HH:MM:SS' format
  const today = date.toISOString().split('T')[0];

  // State for bookings, venues, buildings, and loading/error handling
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [eventNames, setEventNames] = useState([]);
  const navigate = useNavigate();
  const [eventVenues, setEventVenues] = useState([]);

  const { data: bookings, error: userBookingsError, isLoading: userBookingsLoading} = useQuery(
    "UserBookings", async () => {
      const fetchedBookings = await fetchBooking(userID);
      const filteredBookings = fetchedBookings.filter(booking => (booking.DATE > today) || (booking.DATE === today && booking.END_TIME >= currentTime));
      return filteredBookings;
    },
    {
      refetchOnWindowFocus: true, // Refetch when the window is focused
      refetchOnMount: true, // Refetch when the component mounts
    }
  );

  const { data: venues, error: venuesError, isLoading: venuesLoading, refetch: refetchVenues } = useQuery(
    "bookingVenues", async () => {
      const todaysBookings = bookings.filter(booking => booking.DATE === today);
      const namesArray = todaysBookings.map(booking => booking.EVENT_NAME);
      setEventNames(namesArray);

      const fetchedVenues = await fetchVenue();

      // Set corresponding venues for today's bookings
      const venuesArray = todaysBookings.map(booking => {
        const venue = fetchedVenues.find(v => v.VENUE_ID === booking.VENUE_ID);
        return venue ? venue.VENUE_NAME : 'Unknown Venue';
      });
      setEventVenues(venuesArray);

      return fetchedVenues;
    },
    {
      enabled: !!bookings, // Ensure venues refetches when bookings change
    }
  );

  const { data: buildings, error: buildingError, isLoading: buildingsLoading, refetch: refetchBuildings } = useQuery(
    "bookingBuildings", async () => {
      const fetchedBuildings = await fetchBuilding();
      return fetchedBuildings;
    },
    {
      enabled: !!venues, // Ensure buildings refetches when venues change
    }
  );

  useEffect(() => {
    if (bookings) {
      refetchVenues();
    }
  }, [bookings, refetchVenues]);

  useEffect(() => {
    if (venues) {
      refetchBuildings();
    }
  }, [venues, refetchBuildings]);

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

  if (userBookingsLoading || venuesLoading || buildingsLoading) {
    return (
      <>
      <Header />
      <main className='centered-container'>
        <LoadingComponent colour="#D4A843" size="15" isLoading={userBookingsLoading || venuesLoading || buildingsLoading}/> 
      </main>
      <Footer onBookVenueClick={handleOnBookVenueClick} onReportIssueClick={handleOnReportIssueClick} onProfileClick={handleProfileClick}/>
      </>
    );
  }

  if (userBookingsError || buildingError || venuesError) {
    return (
      <>
      <Header />
      <main className='centered-container'>
        <p>Error loading user bookings!!!</p>
      </main>
      <Footer onBookVenueClick={handleOnBookVenueClick} onReportIssueClick={handleOnReportIssueClick} onProfileClick={handleProfileClick}/>
      </>
    );
  }

  const handleCardClick = (booking, venue, building) => {
    console.log('Navigating to event details with:', { booking, venue, building });
    navigate(`/event-details/${booking.EVENT_NAME}`, { state: { booking, venue, building } });
  };

  return (
    <>
      {isPopupOpen && (
        <Popup arrayOfNames={eventNames} onClose={handleClosePopup} arrayOfCorrespondingvenues={eventVenues}/>
      )}
      <main className='home-body'>
        <Header />
        <section className='home-content'>
          {bookings.length > 0 && venues.length > 0 && buildings.length > 0 ? (
            bookings.map((booking, index) => {
              const venue = venues.find(v => v.VENUE_ID === booking.VENUE_ID);
              const building = buildings.find(b => b.BUILDING_ID === venue?.BUILDING_ID);
              // console.log(venue, building);

              return (
                <Card
                  key={index}
                  event={booking.EVENT_NAME}
                  date={booking.DATE}
                  time={`${booking.START_TIME} - ${booking.END_TIME}`}
                  venue={building.BUILDING_NAME} 
                  room={venue.VENUE_NAME}
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
