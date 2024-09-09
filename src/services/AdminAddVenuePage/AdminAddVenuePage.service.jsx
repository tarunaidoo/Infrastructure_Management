//check if building exists
async function fetchBuilding(building_name){
  const endpoint = `/data-api/rest/BUILDING/`;

  try{
    const response = await fetch(endpoint);
    if(!response.ok){
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();
    console.log("Fetched building: ", result);

    //check results for building
    if(result.value && Array.isArray(result.value)){
      //filter by building name
      const building = result.value.find(b => b.BUILDING_NAME === building_name);

      if(building){
        return building;
      }
    }
    return null;
  }
  catch(error){
    console.log("Error fetchig building", error);
    throw error;
  }
}
export {fetchBuilding}

// add the building details to BUILDING table
async function createBuilding(building_name, builiding_location) {
  const data = {
    BUILDING_NAME: building_name,
    BUILDING_LOCATION: builiding_location
  };

  const endpoint = `/data-api/rest/BUILDING/`;

  try{
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if(!response.ok){
      //handle HTTP errors
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    //return result;
    console.log("createBuilding Result: ", result);

    //get the BUILDING_ID from response object
    if(result.value && result.value.length > 0 && result.value[0].BUILDING_ID){
      return result.value[0]; //return first item in the array - BUILDING_ID
    }
    else{
      throw new Error("Building ID not found in response");
    }
  }
  catch(error){
    console.log("Error creating building:", error);
    throw error; //re-throw error being handled by caller
  }
}
export{createBuilding}

//fetch venues to find if venue name already exists or not
async function fetchVenue(venue_name) {
  const endpoint = `/data-api/rest/VENUE/`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();
    console.log("Fetched venue: ", result);

    // Check results for venue
    if (result.value && Array.isArray(result.value)) {
      // Filter by venue name
      const venue = result.value.find(v => v.VENUE_NAME === venue_name);

      if (venue) {
        return venue;
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching venue", error);
    throw error;
  }
}
export { fetchVenue };

// add venue details to VENUE table
async function createVenue(building_id, venue_name, venue_capacity) {
  const data = {
    BUILDING_ID: building_id,
    VENUE_NAME: venue_name,
    VENUE_CAPACITY: venue_capacity,
    VENUE_STATUS: "Available"
  };

  const endpoint = `/data-api/rest/VENUE/`;
  try{
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if(!response.ok){
      //handle server errors
      const errorText = await response.text(); // Get error message
      console.error(`Error: ${response.status} ${response.statusText}: ${errorText}`);
      throw new Error(`Failed to create venue: ${response.statusText}`);
    }
    const result = await response.json();
    console.log("Create Venue result: ", result);
    console.log("Type of createVenue result: ", typeof result);

    //validate result
    if(result && result.value && Array.isArray(result.value) && result.value.length>0){
      const venueData = result.value[0];
      if(venueData && venueData.VENUE_ID){
        return venueData;
      }
    }
    else{
      throw new Error("Create venue response is missing VENUE_ID.");
    }
  }
  catch(error){
    console.log("Error in createVenue,", error);
    throw error;
  }
}
export{createVenue}

//fetch TAG table data
async function fetchTag(tagName){
  const endpoint = `/data-api/rest/TAG`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    const result = await response.json();
    console.log("Fetched tags: ", result);

    // Check results for tags
    if (result.value && Array.isArray(result.value)) {
      // Filter by tag name
      const tag = result.value.find(t => t.TAG_NAME === tagName);

      if (tag) {
        return tag.TAG_ID;
      }
    }
    return null; // Return null if the tag is not found
  } catch (error) {
    console.log("Error fetching tag", error);
    throw error;
  }
}
export {fetchTag};

async function updateTag(building_id, tag_id){
  const endpoint = `/data-api/rest/BUILDING_TAG`;
  const data = {
    BUILDING_ID: building_id,
    TAG_ID: tag_id
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST', // Using POST method to add a new record
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) // Convert data to JSON string
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }
    //check response body
    const result = await response.json();
    console.log("Building Tag updated successfully: ", result);

    return result; // Return the result for further use if needed
  } catch (error) {
    console.error("Error updating building tag", error);
    throw error;
  }
}
export {updateTag}

async function fetchFeature(feature_name) {
  const endpoint = `/data-api/rest/FEATURE`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    console.log("Fetched features: ", result);

    // Check results for features
    if (result.value && Array.isArray(result.value)) {
      // Filter by feature name
      const feature = result.value.find(f => f.FEATURE_NAME === feature_name);
      
      if (feature) {
        return feature.FEATURE_ID;
      } else {
        console.error(`Feature '${feature_name}' not found.`);
      }
    } else {
      console.error("Unexpected response format or empty result.");
    }
    return null; // Return null if the feature is not found
  } catch (error) {
    console.error("Error fetching feature:", error);
    throw error;
  }
}
export { fetchFeature };


async function addVenueFeature(venue_id, feature_id) {
  const endpoint = `/data-api/rest/VENUE_FEATURES`;

  const data = {
    VENUE_ID: venue_id,
    FEATURE_ID: feature_id
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const result = await response.json();
    console.log("Added feature to venue successfully: ", result);
    return result;
  } catch (error) {
    console.error("Error adding feature to venue:", error);
    throw error;
  }
}
export { addVenueFeature };
