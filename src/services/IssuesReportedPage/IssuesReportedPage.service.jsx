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

//update availability status
const updateAvailability = async (venueID, newStatus) => {
    try {
        // Fetch all the venues
        const venues = await fetchVenues();

        // Find the specific venue based on venueID
        const venueToUpdate = venues.find(venue => venue.VENUE_ID === venueID);

        if (!venueToUpdate) {
            throw new Error(`Venue with ID ${venueID} not found`);
        }

        // Prepare the updated venue data with all required fields, excluding VENUE_ID
        const updatedVenue = {
            BUILDING_ID: venueToUpdate.BUILDING_ID,
            VENUE_NAME: venueToUpdate.VENUE_NAME,
            VENUE_CAPACITY: venueToUpdate.VENUE_CAPACITY,
            VENUE_STATUS: newStatus,
            // Add other required fields from venueToUpdate if needed
        };

        // Send the update through PUT without VENUE_ID in the body
        const endpoint = '/data-api/rest/VENUE/VENUE_ID'
        const response = await fetch(`${endpoint}/${venueID}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedVenue),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Update Error:', errorData);
            throw new Error(`Failed to update status for venue: ${venueID}. Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to update venue availability:', error);
        throw error;
    }
};

export { updateAvailability };
