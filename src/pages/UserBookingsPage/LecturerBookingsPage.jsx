import React, { useState, useEffect } from 'react';
import Header from '../../components/NavigationHeader/NavigationHeader';
import BookedEventsCard from '../../components/BookedEventsCards/BookedEventsCards';
import { fetchAllBookings, fetchAllUsers, fetchAllVenues } from '../../services/UserBookingsPage/LecturerBookingsPage.service';

function LecturerBookingPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const allBookings = allBookingsResponse.value || [];
                const allUsers = allUsersResponse.value || [];
                const allVenues = allVenuesResponse.value || [];

                // Log fetched data to debug
                console.log('Fetched bookings:', allBookings);
                console.log('Fetched users:', allUsers);
                console.log('Fetched venues:', allVenues);

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

                // Create a map of lecturer USER_IDs
                const lecturerUserIds = new Set(
                    allUsers.filter(user => user.USER_ROLE === 'Lecturer').map(user => user.USER_ID)
                );

                // Filter bookings to include only those where USER_ID is a lecturer
                const lecturerBookings = allBookings.filter(booking => lecturerUserIds.has(booking.USER_ID));

                // Map venue data to bookings
                const venueMap = new Map(allVenues.map(venue => [venue.VENUE_ID, venue.VENUE_NAME]));

                // Add venueName to each booking
                const bookingsWithVenues = lecturerBookings.map(booking => ({
                    ...booking,
                    venueName: venueMap.get(booking.VENUE_ID) || 'Unknown Venue',  // Handle missing venues
                }));

                console.log('Processed bookings with venues:', bookingsWithVenues);

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Header title={"Lecturer Bookings"} />
            <div className="bookings-list">
                {bookings.length > 0 ? (
                    bookings.map(booking => (
                        <BookedEventsCard
                            key={booking.BOOKING_ID}
                            eventName={`Booking ID: ${booking.BOOKING_ID}`}
                            eventDetails={{
                                title: `Booking for: ${booking.USER_ID}`,
                                lecturerName: booking.USER_ID,  // Assuming USER_ID represents the lecturer's name
                                date: booking.DATE,
                                time: `${booking.START_TIME} - ${booking.END_TIME}`,
                                venue: booking.venueName,
                            }}
                        />
                    ))
                ) : (
                    <div>No bookings found.</div>
                )}
            </div>
        </>
    );
}

export default LecturerBookingPage;