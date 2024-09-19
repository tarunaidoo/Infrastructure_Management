// Function to fetch all bookings
export const fetchAllBookings = async () => {
    try {
        const response = await fetch(`/data-api/rest/BOOKING`);
        if (!response.ok) {
            throw new Error("Failed to fetch bookings");
        }
        const bookings = await response.json();
        // console.log('Type of bookings:', typeof bookings);
        // console.log("Fetched bookings:", bookings);
        return bookings;
    } catch (error) {
        console.error("Error fetching all bookings:", error);
        throw error;
    }
};

// Function to fetch all venues
export const fetchAllVenues = async () => {
    try {
        const response = await fetch(`/data-api/rest/VENUE`);
        if (!response.ok) {
            throw new Error("Failed to fetch venues");
        }
        const venues = await response.json();
        // console.log('Type of venues:', typeof venues);
        // console.log("Fetched venues:", venues);
        return venues;
    } catch (error) {
        console.error("Error fetching all venues:", error);
        throw error;
    }
};


// Function to fetch all users
export const fetchAllUsers = async () => {
    try {
        const response = await fetch(`/data-api/rest/USERS`);
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        // console.log('Type of allUsers:', typeof users);
        // console.log("Fetched users:", users);
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};
