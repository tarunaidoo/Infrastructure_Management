
const getUserDetailsFromUserID = async (userID) => {
    try {
        const endpoint = "/data-api/rest/USERS";
        const response = await fetch(endpoint);
        const data = await response.json();

        // Filter the data based on the provided USER_ID
        const filteredData = data.value.filter(row => row.USER_ID === userID);
        return filteredData ? filteredData[0] : null;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const getVenuesFromBuildingIDAndUserID = async (buildingID, userID) => {
    try {
        const endpoint = "data-api/rest/VENUE/"
        const response = await fetch(endpoint);
        const data = await response.json();

        // Filter the data based on the provided BUILDING_ID and VENUE_STATUS
        if (userID === "Student"){
            const filteredData = data.value.filter(row => (row.BUILDING_ID === buildingID && row.VENUE_STATUS === "Available"));
            return filteredData
        }
        const filteredData = data.value.filter(row => row.BUILDING_ID === buildingID);
        return filteredData
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const getVenueFeatureIDFromVenueID = async ( id ) => {
    try {
        const endpoint = "data-api/rest/VENUE_FEATURES/";
        const response = await fetch(endpoint);
        const data = await response.json();

        // Filter the data based on the provided VENUE_ID
        const filteredData = data.value.filter(row => row.VENUE_ID === id); 

        return filteredData; // Return the filtered data
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const getVenueFeatureNamesFromVenues = async (venues) => {
    const featuresEndpoint = "data-api/rest/FEATURE/";
    const featuresResponse = await fetch(featuresEndpoint);
    const featuresdata = await featuresResponse.json();

    const venuesWithFeatures = await Promise.all(venues.map(async (venue) => {
        const venueFeatures = await getVenueFeatureIDFromVenueID(venue.VENUE_ID);
        const featureNames = featuresdata.value.filter(row => 
            venueFeatures.some(element => element.FEATURE_ID === row.FEATURE_ID)
        );

        return {
            ...venue,
            FEATURES: featureNames,
        };
    }));

    return venuesWithFeatures;
}


export {getUserDetailsFromUserID, getVenuesFromBuildingIDAndUserID, getVenueFeatureIDFromVenueID, getVenueFeatureNamesFromVenues};
