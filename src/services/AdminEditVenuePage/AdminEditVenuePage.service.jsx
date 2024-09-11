
async function getBuilding(building_name) {
    const endpoint = `/data-api/rest/BUILDING`;
    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.value && Array.isArray(data.value)) {
        const building = data.value.find(b => b.BUILDING_NAME === building_name);
        if (building) {
            const building_data = {
                building_id: building.BUILDING_ID,
                building_name: building.BUILDING_NAME
            }
            return building_data;
        } else {
            console.log(`Building with name '${building_name}' not found.`);
            return null;
        }
    } else {
        console.log("No valid data found.");
        return null;
    }
}
async function getVenue(venue_name) {
    const endpoint = `/data-api/rest/VENUE`;
    const response = await fetch(endpoint);
    const data = await response.json();
    //console.table(data.value);

    if (data.value && Array.isArray(data.value)) {
        const venue = data.value.find(b => b.VENUE_NAME === venue_name);
        if (venue) {
            const venue_data = {
                venue_id: venue.VENUE_ID,
                venue_name: venue.VENUE_NAME,
                venue_capacity: venue.VENUE_CAPACITY,
                venue_status: venue.VENUE_STATUS
            }
            return venue_data;
        } else {
            console.log(`Venue with name '${venue_name}' not found.`);
            return null;
        }
    } else {
        console.log("No valid data found.");
        return null;
    }
}

async function getFeatures(venue_id) {
    const endpoint = '/data-api/rest/VENUE_FEATURES';
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();

        // Ensure data exists and is an array
        if (data.value && Array.isArray(data.value)) {

            // Filter all features for the given venue_id
            const featuresForVenue = data.value.filter(f => f.VENUE_ID === venue_id);

            if (featuresForVenue.length > 0) {
                // Collect both ROOM_FEATURE_ID and FEATURE_ID in an array of objects
                const featureDetails = featuresForVenue.map(feature => ({
                    ROOM_FEATURE_ID: feature.ROOM_FEATURE_ID, // Add this property if it exists
                    FEATURE_ID: feature.FEATURE_ID
                }));

                // Return an object containing all feature details
                return { featureDetails };
            } else {
                console.log(`No features found for venue with ID '${venue_id}'.`);
                return null;
            }
        } else {
            console.log("No valid data found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching features:", error);
        throw error;
    }
}

async function getFeatureNames() {
    const endpoint = `/data-api/rest/FEATURE`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();

        // Map the FEATURE_ID and FEATURE_NAME into an array of objects
        const featureInfo = data.value.map(feature => ({
            FEATURE_ID: feature.FEATURE_ID,
            FEATURE_NAME: feature.FEATURE_NAME
        }));

        // Return the array of feature objects
        return featureInfo;
    } catch (error) {
        console.error("Error fetching features:", error);
        throw error;
    }
}

async function updateVenue(data,venue_id){
    const endpoint = `/data-api/rest/VENUE/VENUE_ID/${venue_id}`;
    try {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Update Error:', errorData);
            throw new Error(`Failed to update status for venue: ${venue_id}. Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to update venue availability:', error);
        throw error;
    }

}

export { getBuilding, getVenue, getFeatures, getFeatureNames,updateVenue}