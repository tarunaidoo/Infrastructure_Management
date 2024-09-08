//fetch ISSUES from MAINTENANCE
async function fetchIssues() {
    const endpoint = '/data-api/rest/MAINTENANCE_ISSUE';
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log("Issues: ", data);
        
        if (data && data.value) {
            return data.value; // Return the array of issues
        } else {
            console.error('Unexpected API response structure', data);
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch issues', error);
        return [];
    }
}
export {fetchIssues};

//fetch VENUES from VENUE
async function fetchVenues() {
    const endpoint = '/data-api/rest/VENUE';
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log("Venues: ", data);
        
        if (data && data.value) {
            return data.value; // Return the array of venues
        } else {
            console.error('Unexpected API response structure', data);
            return [];
        }
    } catch (error) {
        console.error('Failed to fetch venues', error);
        return [];
    }
}
export {fetchVenues};

// Adjusted function to include VENUE_NAME and enhanced error handling
const updateVenueAvailability = async (venueID, status) => {
    try {
        // Fetch the venue details to get VENUE_NAME
        const venuesData = await fetchVenues(); // Fetch all venues
        console.log('Fetched venues data:', venuesData);

        const venue = venuesData.find(v => v.VENUE_ID === venueID); // Find the venue by ID

        if (!venue) {
            console.error('Venue not found. Venue ID:', venueID);
            throw new Error('Venue not found');
        }

        const payload = {
            VENUE_NAME: venue.VENUE_NAME, // Include VENUE_NAME
            VENUE_STATUS: status, // Update the status
        };

        console.log('Request payload:', payload);

        const response = await fetch(`/data-api/rest/VENUE/${venueID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (!response.ok) {
            console.error('Error response data:', responseData);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return responseData;
    } catch (error) {
        console.error('Error updating venue availability:', error);
        throw error; // Re-throw to be handled by caller
    }
};
export {updateVenueAvailability};
