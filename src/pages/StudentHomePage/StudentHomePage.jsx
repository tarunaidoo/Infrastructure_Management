import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/HomePageHeader/StudentHomeHeader';
import Card from '../../components/HomePageCard/HomePageCard';
import Footer from '../../components/NavigationBar/StudentHomeFooter';
import './StudentHomePage.css';
import { fetchBooking, fetchVenue, fetchBuilding } from "../../services/HomePages/HomePage.service";

function StudentHomePage() {
    const userID = '2546838@students.wits.ac.za';
    const navigate = useNavigate();

    // State for bookings, venues, buildings, and loading/error handling
    const [bookings, setBookings] = useState([]);
    const [venues, setVenues] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch bookings first
                const fetchedBookings = await fetchBooking(userID);
                setBookings(fetchedBookings);

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

    const handleOnReportIssueClick = () => {
        const venueSelectionDetails = {
            SOURCE_PAGE: "/student-home",
            DESTINATION_PAGE: "/report-issue"
        }
        navigate("/campus-selection", { state: venueSelectionDetails });
    }

    if (loading) {
        return <div>Connecting...</div>; // Display 'Connecting...' while loading
    }

    if (error) {
        return <div>{error}</div>; // Display error message if there's an issue
    }
  return (
    <>
    <section className='home-body'>
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
        <Footer onReportIssueClick={handleOnReportIssueClick} />
      </section>
    </>
  );
}

export default StudentHomePage;
