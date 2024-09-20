import React, { useState, useEffect } from 'react';
import Header from '../../components/NavigationHeader/NavigationHeader';
import BookedEventsCard from '../../components/BookedEventsCards/BookedEventsCards';
import Popup from '../../components/PopUpEventsBooked/PopUpEventsBooked';  // Import the Popup component
import { fetchAllBookings, fetchAllUsers, fetchAllVenues } from '../../services/UserBookingsPage/UserBookingPage.service';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/NavigationBar/AdminHomeFooter';
function StudentBookingPage() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    //const [venues, setVenues] = useState([]);
    //const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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

                // Log fetched data to debug
                // console.log('Fetched bookings:', allBookings);
                // console.log('Fetched users:', allUsers);
                // console.log('Fetched venues:', allVenues);

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

                // Filter users to get only students
                const studentIds = allUsers.filter(user => user.USER_ROLE === 'Student').map(user => user.USER_ID);

                // Filter bookings to get only those with student user IDs
                const studentBookings = allBookings.filter(booking => studentIds.includes(booking.USER_ID));

                // Map venue data to bookings
                const venueMap = new Map(allVenues.map(venue => [venue.VENUE_ID, venue.VENUE_NAME]));

                // Add venueName to each booking
                const bookingsWithVenues = studentBookings.map(booking => ({
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleHeaderBackIconClick = () => {
        navigate("/admin-home");
    }

    return (
        <>
            <Header title={"All Bookings"} onClick={handleHeaderBackIconClick} />
            <main className="bookings-list">
                {bookings.length > 0 ? (
                    bookings.map(booking => {
                        // Extract the part of the email before the "@" symbol
                        const username = booking.USER_ID.split('@')[0];
                        
                        return (
                            <BookedEventsCard
                                key={booking.BOOKING_ID}
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
            <Footer/>
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

export default StudentBookingPage;
