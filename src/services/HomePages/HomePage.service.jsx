// Retry logic helper function
async function retryFetch(fetchFn, retries = 15, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetchFn();
      } catch (error) {
        if (i === retries - 1) throw error; // After retries, rethrow the error
        console.log('Connecting...')
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
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
  
      // Check results for building
      if (result.value && Array.isArray(result.value)) {
        // Filter by building id
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
  
      // Check results for venue
      if (result.value && Array.isArray(result.value)) {
        // Filter by venue_id
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
        console.log('Reattempting...')
      }
      
      const result = await response.json();
      console.log("Fetched booking data: ", result);
  
      // Check results for booking
      if (result.value && Array.isArray(result.value)) {
        // Filter all bookings by user id
        const bookings = result.value.filter(b => b.USER_ID === user_id);
        return bookings.length > 0 ? bookings : [];
      }
      return [];
    };
  
    return retryFetch(fetchFn);
  }
  
  export { fetchBooking, fetchVenue, fetchBuilding };
  