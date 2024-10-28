import { useMutation, useQueryClient } from 'react-query';

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
async function fetchBuilding() {
  const endpoint = `/data-api/rest/BUILDING/`;

  const fetchFn = async () => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();

    if (result.value && Array.isArray(result.value)) {
      return result.value || [];
    }
    return null;
  };

  return retryFetch(fetchFn);
}

// Fetch venue based on bookings
async function fetchVenue() {
  const endpoint = `/data-api/rest/VENUE/`;

  const fetchFn = async () => {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();

    if (result.value && Array.isArray(result.value)) {
      return result.value || [];
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

    if (result.value && Array.isArray(result.value)) {
      const bookings = result.value.filter(b => b.USER_ID === user_id);
      return bookings.length > 0 ? bookings : [];
    }
    return [];
  };

  return retryFetch(fetchFn);
}

// Deletes Booking based of booking ID
const deleteBooking = async (booking_id) => {
  const endpoint = `/data-api/rest/BOOKING`;
  const response = await fetch(`${endpoint}/BOOKING_ID/${booking_id}`, {
    method: "DELETE"
  });
  
  if (response.ok) {
    console.log(`Deleted Booking with ID ${booking_id}`);
  } else {
    console.log(`Failed to delete Booking with ID ${booking_id}`);
  }
};


const useDeleteBooking = ()  => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      // Invalidate any queries related to bookings to keep data fresh
      queryClient.invalidateQueries('bookings');
    },
    onError: (error) => {
      console.error('Error deleting booking:', error);
    },
  });
}


export { fetchBooking, fetchVenue, fetchBuilding, deleteBooking, useDeleteBooking};
