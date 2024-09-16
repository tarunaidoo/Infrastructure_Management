// Function to create a booking
export async function createBooking(data) {
  const endpoint = '/data-api/rest/BOOKING';
  
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  
  return response;
}

// Utility function to check if two time intervals overlap
export const isOverlapping = (existingStart, existingEnd, newStart, newEnd) => {
  // Check if new interval overlaps with the existing one
  return newStart < existingEnd && newEnd > existingStart;
};

const getBookingsByVenueIDAndDate = async (venueID, date) => {
  try{
    const endpoint = "data-api/rest/BOOKING/"
    const response = await fetch(endpoint);
    const data = await response.json();

    // Filter the data based on the provided BUILDING_LOCATION
    const filteredData = data.value.filter(row => row.DATE === date);

    return filteredData; // Return the filtered data
}
catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array or handle the error as needed
}
}

// Function to check for overlaps
export const checkForOverlap = async (venueId, date, newStartTime, newEndTime) => {
  try {
    const bookings = await getBookingsByVenueIDAndDate(venueId, date);
    if (!Array.isArray(bookings)) {
      throw new Error("Bookings data is not an array");
    }

    // Convert new booking times to timestamps
    const newStart = new Date(`1970-01-01T${newStartTime}`).getTime();
    const newEnd = new Date(`1970-01-01T${newEndTime}`).getTime();

    // Check if any existing booking overlaps with the new booking
    return bookings.some(booking => {
      const existingStart = new Date(`1970-01-01T${booking.START_TIME}`).getTime();
      const existingEnd = new Date(`1970-01-01T${booking.END_TIME}`).getTime();
      return isOverlapping(existingStart, existingEnd, newStart, newEnd);
    });
    
  } catch (error) {
    console.error("Error checking for overlap:", error);
    throw error;
  }
};


