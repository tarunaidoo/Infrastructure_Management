
const filterBookingsByVenueIDAndDate = (bookings, venueID, date) => {
    // Filter bookings by VENUE_ID & DATE
    const filtredData = bookings.filter(row => (row.VENUE_ID === venueID && row.DATE === date));
    return filtredData;
}


// Utility function to check if two time intervals overlap
const isOverlapping = (existingStart, existingEnd, newStart, newEnd) => {
    // Check if new interval overlaps with the existing one
    return newStart < existingEnd && newEnd > existingStart;
};


// Function to check for overlaps
const checkForTimeClash = (bookings, venueID, date, newStartTime, newEndTime) => {
    const filteredBookings = filterBookingsByVenueIDAndDate(bookings, venueID, date);

    // Convert new booking times to timestamps
    const newStart = new Date(`1970-01-01T${newStartTime}`).getTime();
    const newEnd = new Date(`1970-01-01T${newEndTime}`).getTime();

    // Check if any existing booking overlaps with the new booking
    return filteredBookings.some(booking => {
        const existingStart = new Date(`1970-01-01T${booking.START_TIME}`).getTime();
        const existingEnd = new Date(`1970-01-01T${booking.END_TIME}`).getTime();
        return isOverlapping(existingStart, existingEnd, newStart, newEnd);
    });
}


export { filterBookingsByVenueIDAndDate, isOverlapping, checkForTimeClash };
