//fetch ISSUES from MAINTENANCE
async function fetchIssues() {
    const endpoint = '/data-api/rest/MAINTENANCE_ISSUE';
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        // console.log("Issues: ", data);
        
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
        // console.log("Venues: ", data);
        
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