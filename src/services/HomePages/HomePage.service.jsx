// Retry logic helper function
async function retryFetch(fetchFn, retries = 15, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (i === retries - 1) throw error; // After retries, rethrow the error
      console.log('Connecting...'); // Retry message
      await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
    }
  }
}

// Fetch building based on venue
async function fetchBuilding(building_id) {
  const endpoint = `/data-api/rest/BUILDING/`;

  const fetchFn = async () => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();
    console.log("Fetched building: ", result);

    if (result.value && Array.isArray(result.value)) {
      const building = result.value.find(b => b.BUILDING_ID === building_id);
      return building || null;
    }
    return null;
  };

  return retryFetch(fetchFn);
}

// Fetch venue based on bookings
async function fetchVenue(venue_id) {
  const endpoint = `/data-api/rest/VENUE/`;

  const fetchFn = async () => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();
    console.log("Fetched venue: ", result);

    if (result.value && Array.isArray(result.value)) {
      const venue = result.value.find(v => v.VENUE_ID === venue_id);
      return venue || null;
    }
    return null;
  };

  return retryFetch(fetchFn);
}

// Fetch user's bookings
async function fetchBooking(user_id) {
  const endpoint = `/data-api/rest/BOOKING/`;

  const fetchFn = async () => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();
    console.log("Fetched booking data: ", result);

    if (result.value && Array.isArray(result.value)) {
      const bookings = result.value.filter(b => b.USER_ID === user_id);
      return bookings.length > 0 ? bookings : [];
    }
    return [];
  };

  return retryFetch(fetchFn);
}

// Deletes Booking based of booking ID
async function deleteBooking(booking_id) 
{
  const endpoint = `/data-api/rest/BOOKING`
  const response = await fetch(`${endpoint}/BOOKING_ID/${booking_id}`, {
    method: "DELETE"
  });
  if(response.ok){
    console.log(`Deleted Booking with ID ${booking_id}`);
  }
  if (!response.ok) {
    const errorText = await response.text();
    console.log(`Failed to delete Booking with ID ${booking_id}`);
    console.error(errorText);
  }
}

export { fetchBooking, fetchVenue, fetchBuilding, deleteBooking };