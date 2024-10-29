// Function to create a booking
const createBooking = async (data) => {
    const endpoint = '/data-api/rest/BOOKING';

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return response;
}

const getBookings = async () => {
    try {
        const endpoint = "data-api/rest/BOOKING/"
        const response = await fetch(endpoint);
        const data = await response.json();

        return data.value;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const getEventsBookings = async () => {
    try {
        const endpoint = "https://eventsapi3a.azurewebsites.net/api/events"
        const response = await fetch(endpoint);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const getTutoringBookings = async () => {
    const endpoint = "https://witscampustutoring.azurewebsites.net/api/bookings";
  
  // Define a timeout promise that rejects after a set period (e.g., 10000 ms or 10 seconds)
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
    );

  try {
    // Use Promise.race to race the fetch against the timeout
    const response = await Promise.race([
      fetch(endpoint),
      timeoutPromise
    ]);

    // Check if the fetch was successful and process the response
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array or handle the error as needed
  }
}


export {createBooking, getBookings, getEventsBookings, getTutoringBookings};
