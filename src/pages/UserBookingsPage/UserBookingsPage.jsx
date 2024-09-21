import React, { useState, useEffect } from 'react';
import Header from '../../components/NavigationHeader/NavigationHeader';
import BookedEventsCard from '../../components/BookedEventsCards/BookedEventsCards';
import Popup from '../../components/PopUpEventsBooked/PopUpEventsBooked';  // Import the Popup component
import { fetchAllBookings, fetchAllUsers, fetchAllVenues } from '../../services/UserBookingsPage/UserBookingPage.service';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
import './UserBookingsPage.css';
function UserBookingPage() {
    const userID = localStorage.getItem('userEmail'); // get userID
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [venues, setVenues] = useState([]);
    //const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedVenue, setSelectedVenue] = useState('');

    //get bookings from today and for future
    const filterBookingsByDate = (bookingDate) =>{
        const today = new Date();
        const bookingDateObj = new Date(bookingDate);
        return bookingDateObj >= today.setHours(0,0,0,0);//keep bookings for today and future datesa
    };
    //sort bookings by date to display closest first
    const sortBookingsByDate = (a,b) =>{
        return new Date(a.DATE) - new Date(b.DATE);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all bookings, users, and venues
                const [allBookingsResponse, allUsersResponse, allVenuesResponse] = await Promise.all([
                    fetchAllBookings(),
                    fetchAllUsers(),
                    fetchAllVenues(),
                ]);

                // Extract the arrays from the response objects
                const allBookings = allBookingsResponse.value || [];  // Access the array using 'value'
                const allUsers = allUsersResponse.value || [];        // Access the array using 'value'
                const allVenues = allVenuesResponse.value || [];      // Access the array using 'value'

                // Check if the fetched data is in the expected format
                if (!Array.isArray(allBookings)) {
                    throw new TypeError('Expected allBookings to be an array.');
                }
                if (!Array.isArray(allUsers)) {
                    throw new TypeError('Expected allUsers to be an array.');
                }
                if (!Array.isArray(allVenues)) {
                    throw new TypeError('Expected allVenues to be an array.');
                }

                // Map venue data to bookings
                const venueMap = new Map(allVenues.map(venue => [venue.VENUE_ID, venue.VENUE_NAME]));

                // Add venueName to each booking
                const bookingsWithVenues = allBookings.map(booking => ({
                    ...booking,
                    venueName: venueMap.get(booking.VENUE_ID) || 'Unknown Venue',  // Handle missing venues
                    eventName: booking.EVENT_NAME
                    ? booking.EVENT_NAME
                    : `Booking for ${booking.USER_ID.split('@')[0]}`,  // Handle null EVENT_NAME
                }))
                .filter(booking => filterBookingsByDate(booking.DATE))
                .sort(sortBookingsByDate);

                //console.log('Processed student bookings with venues:', bookingsWithVenues);

                setBookings(bookingsWithVenues);
                setVenues(allVenues);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(`Failed to load data: ${error.message}`);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const openPopup = (booking) => {
        setSelectedBooking(booking);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedBooking(null);
    };

    const handleVenueChange = (venueID) =>{
        setSelectedVenue(venueID ? Number(venueID): '');
    };

    const filteredBookings = bookings.filter(booking => {
        const matches = selectedVenue ? String(booking.VENUE_ID) === String(selectedVenue) : true;
        console.log(`Booking ID: ${booking.BOOKING_ID}, Venue ID: ${booking.VENUE_ID}, Matches: ${matches}`);
        return matches;
    });
    console.log('Filtered Bookings:', filteredBookings);
    console.log('All Bookings:', bookings);
    bookings.forEach(booking => {
        console.log(`Booking ID: ${booking.BOOKING_ID}, Venue ID: ${booking.VENUE_ID}`);
    });
    console.log('Selected Venue:', selectedVenue);
       
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleHeaderBackIconClick = () => {
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

    return (
        <>
            <Header title={"All Bookings"} onClick={handleHeaderBackIconClick} />
            <div className="venue-filter">
                <select onChange={(e) => handleVenueChange(e.target.value)} value={selectedVenue}>
                    <option value="">All Venues</option>
                    {venues.map(venue => (
                        <option key={venue.VENUE_ID} value={venue.VENUE_ID}>
                            {venue.VENUE_NAME}
                        </option>
                    ))}
                </select>
            </div>
            <main className="bookings-list">
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => {
                        // Extract the part of the email before the "@" symbol
                        const username = booking.USER_ID.split('@')[0];
                        
                        return (
                            <BookedEventsCard
                                key={booking.BOOKING_ID}
                                className="booked-event-card"
                                eventName={booking.eventName}
                                eventDetails={{
                                    title: `${booking.EVENT_NAME}`,
                                    studentName: username,
                                    date: booking.DATE,
                                    time: `${booking.START_TIME} - ${booking.END_TIME}`,
                                    venue: booking.venueName,
                                }}
                                onClick={() => openPopup(booking)}
                            />
                        );
                    })
                ) : (
                    <label>No bookings found.</label>
                )}
            </main>
            <Footer onAddVenueClick={handleAddVenueClick} onEditVenueClick={handleEditVenueClick} onProfileClick={handleProfileClick}/>
            {isPopupOpen && selectedBooking && (
                <Popup
                    title={`Booking ID: ${selectedBooking.BOOKING_ID}`}
                    studentName={selectedBooking.USER_ID.split('@')[0]} // Display the username part
                    date={selectedBooking.DATE}
                    time={`${selectedBooking.START_TIME} - ${selectedBooking.END_TIME}`}
                    venue={selectedBooking.venueName}
                    room={selectedBooking.ROOM}
                    onClose={closePopup}
                />
            )}
        </>
    );
}

export default UserBookingPage;
