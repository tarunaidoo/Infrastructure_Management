
const getBuildingsFromCampus = async ( campus ) => {
    try{
        const endpoint = "data-api/rest/BUILDING/"
        const response = await fetch(endpoint);
        const data = await response.json();

        // Filter the data based on the provided BUILDING_LOCATION
        const filteredData = data.value.filter(row => row.BUILDING_LOCATION === campus);

        return filteredData; // Return the filtered data
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const getBuildingTagsIDFromBuildingID = async ( id ) => {
    try {
        const endpoint = "data-api/rest/BUILDING_TAG/";
        const response = await fetch(endpoint);
        const data = await response.json();

        // Filter the data based on the provided BUILDING_ID
        const filteredData = data.value.filter(row => row.BUILDING_ID === id); 

        return filteredData; // Return the filtered data
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return []; // Return an empty array or handle the error as needed
    }
}


const getBuildingTagNamesForBuildings = async (buildings) => {
    const tagsEndpoint = "data-api/rest/TAG/";
    const tagsResponse = await fetch(tagsEndpoint);
    const tagsData = await tagsResponse.json();

    const buildingsWithTags = await Promise.all(buildings.map(async (building) => {
        const buildingTags = await getBuildingTagsIDFromBuildingID(building.BUILDING_ID);
        const tagNames = tagsData.value.filter(row =>
            buildingTags.some(element => row.TAG_ID === element.TAG_ID)
        );

        return {
            ...building,
            TAGS: tagNames,
        };
    }));

    return buildingsWithTags;
};


export {getBuildingsFromCampus, getBuildingTagsIDFromBuildingID, getBuildingTagNamesForBuildings};
