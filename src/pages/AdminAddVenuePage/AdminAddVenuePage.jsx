import React, { useState /*,useEffect*/ } from "react";
import Header from '../../components/NavigationHeader/NavigationHeader';
import './AdminAddVenuePage.css';
import ExistingVenuePopup from '../../components/ExistingVenuePopup/ExistingVenuePopup';
import AddPopup from '../../components/AddVenuePopup/AddVenuePopup';
import ConfirmPopup from '../../components/VenueConfirmedPopup/VenueConfirmedPopup';
import InvalidPopup from '../../components/InvalidVenuePopup/InvalidVenuePopup';
import { fetchBuilding, createBuilding, fetchVenue, createVenue, fetchTag, updateTag, fetchFeature, addVenueFeature } from "../../services/AdminAddVenuePage/AdminAddVenuePage.service";


const AdminAddVenuePage = () => {
    // State for input fields
    const [formFields, setFormFields] = useState({
        building: '',
        building_location: '',
        buildingTag1: '',
        room: '',
        roomCapacity: '',
        roomFeatures: [],
    });

    // State for managing popup visibility
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [showConfirmedPopup, setShowConfirmedPopup] = useState(false);
    const [showInvalidPopup, setShowInvalidPopup] = useState(false);
    const [showExistingVenuePopup, setShowExistingVenuePopup] = useState(false);
    // Update field values
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormFields({
            ...formFields,
            [name]: value
        });
    };

    // Handle checkbox changes
    const handleCheckBoxChange = (e) => {
        const { value, checked } = e.target;
        setFormFields(prevState => {
            const updatedFeatures = checked
                ? [...prevState.roomFeatures, value]
                : prevState.roomFeatures.filter(feature => feature !== value);
            return { ...prevState, roomFeatures: updatedFeatures };
        });
    };
    

    // Handle submit action (trigger AddPopup)
    const handleSubmit = () => {
        const { building, building_location, buildingTag1, room, roomFeatures } = formFields;

        if (!building || !building_location || !buildingTag1 || !room || !roomFeatures) {
            // Show invalid popup if any field is empty
            setShowInvalidPopup(true);
            return;
        }

        // Show AddPopup for confirmation if all fields are filled
        setShowConfirmationPopup(true);
    };

    // Handle confirmation action (after user confirms on AddPopup)
    const handleConfirm = async () => {
        setShowConfirmationPopup(false); // Close confirmation popup
      
        const { building, building_location, room, roomCapacity, roomFeatures } = formFields;
      
        try {
          // Check if the venue already exists
          const venueExists = await fetchVenue(room);
      
          if (venueExists) {
            setShowExistingVenuePopup(true); //popup showing venue exists already
            return; // Stop further execution if venue exists
          }
      
          // Check if building exists
          const existingBuilding = await fetchBuilding(building);
          let building_id;
      
          if (existingBuilding && existingBuilding.BUILDING_ID) {
            building_id = existingBuilding.BUILDING_ID;
            console.log("Building already exists with ID: ", building_id);
          } else {
            const buildingResult = await createBuilding(building, building_location);
            console.log("Building Result: ", buildingResult);
      
            if (buildingResult && buildingResult.BUILDING_ID) {
              building_id = buildingResult.BUILDING_ID;
            } else {
              console.error("Error: Building ID not returned.");
              throw new Error("Failed to create building.");
            }
          }
      
          // Create venue
          const venueResult = await createVenue(building_id, room, roomCapacity);
          console.log("Venue Result: ", venueResult);
      
          if (venueResult && venueResult.VENUE_ID) {
            // Add features to venue_features table
            for (const feature of roomFeatures) {
              const feature_id = await fetchFeature(feature);
              if (feature_id) {
                await addVenueFeature(venueResult.VENUE_ID, feature_id);
              } else {
                console.error(`Error: Feature '${feature}' not found.`);
              }
            }
            setShowConfirmedPopup(true); // Success message
          } else {
            console.error("Error: Venue result is empty or not as expected.");
            throw new Error("Failed to create venue.");
          }
        } catch (error) {
          console.error("Error in handleConfirm:", error);
          setShowInvalidPopup(true); // Show invalid popup on error
        }
      };
      
    
    const handleTagSelection = async (e) => {
        const selectionTagName = e.target.value;
        setFormFields(prevFields => ({
            ...prevFields,
            buildingTag1: selectionTagName
        }));
    
        // Proceed with further actions if necessary
        if (selectionTagName && formFields.building) {
            await handleUpdateBuildingTag(formFields.building, selectionTagName);
        }
    };

    const handleUpdateBuildingTag = async (buildingName, tagName) => {
        try {
          // Fetch the TAG_ID based on the tagName
          const tagId = await fetchTag(tagName);
      
          if (tagId) {
            // Fetch the BUILDING_ID based on the buildingName (assumed function)
            const building = await fetchBuilding(buildingName);
      
            if (building && building.BUILDING_ID) {
              // Update the BUILDING_TAG table with BUILDING_ID and TAG_ID
              await updateTag(building.BUILDING_ID, tagId);
            } else {
              console.log("Building not found.");
            }
          } else {
            console.log("Tag not found.");
          }
        } catch (error) {
          console.error("Error updating building tag", error);
        }
      };
    

    /*useEffect(() => { //testing the createVenue with dummy data - it works
        const testCreateVenue = async () => {
          try {
            const dummyBuildingID = 1; // Replace with a valid building ID from your DB
            const dummyVenueName = "Test Venue";
            const dummyVenueCapacity = 100;
    
            const result = await createVenue(dummyBuildingID, dummyVenueName, dummyVenueCapacity);
            console.log('Venue creation result:', result);
          } catch (error) {
            console.error('Error creating venue:', error);
          }
        };
    
        testCreateVenue();
      }, []);*/



    // Handle cancellation action (user clicks No on AddPopup)
    const handleCancel = () => {
        setShowConfirmationPopup(false); //pick yes or no popup
    };

    // Handle close action for confirmed or invalid popups
    const handleClose = () => {
        setShowConfirmedPopup(false);
        setShowInvalidPopup(false);
        setShowExistingVenuePopup(false);
    };

    return (
        <>
            <Header title="Add a Venue"/>
            <main className="adding-form">
                <h2 className="heading-tags">Building:</h2>
                <input
                  type="text"
                  name="building"
                  placeholder="Enter building"
                  className="input-field"
                  value={formFields.building}
                  onChange={handleChange}
                />
                <h2 className="heading-tags">Building Location:</h2>
                <select
                  name="building_location"
                  placeholder="Choose building location"
                  className="input-field"
                  value={formFields.building_location}
                  onChange={handleChange}
                >
                    <option value="">Select building location</option>
                    <option value="East Campus">East Campus</option>
                    <option value="West Campus">West Campus</option>
                </select>
                  
                <h2 className="heading-tags">Building Tag:</h2>
                <select
                name="buildingTag1"
                className="input-field"
                value={formFields.buildingTag1}
                onChange={handleTagSelection}>
                    <option value="">Select the type of venue</option>
                    <option value="Computer Labs">Computer Labs</option>
                    <option value="Lecture Halls">Lecture Halls</option>
                    <option value="Tutorial Rooms">Tutorial Rooms</option>
                </select>
                
                <h2 className="heading-tags">Room:</h2>
                <input
                  type="text"
                  name="room"
                  placeholder="Enter room"
                  className="input-field"
                  value={formFields.room}
                  onChange={handleChange}
                />
                <h2 className="heading-tags">Room Capacity:</h2>
                <input
                   type="text"
                   name="roomCapacity"
                   placeholder="Enter max capacity"
                   className="input-field"
                   value={formFields.roomCapacity}
                   onChange={handleChange}
                />
                <h2 className="heading-tags">Room Features:</h2>
                <section className="add-venue-checkboxes">
                    {['Computers',
                    'Desks', 
                    'Chairs', 
                    'Projector', 
                    'Chalk Board',
                    'White Board'].map(feature => (
                        <label className="add-venue-checkbox-label" key={feature}>
                          
                            <input
                                type="checkbox"
                                className="add-venue-checkbox-input"
                                value={feature}
                                checked={formFields.roomFeatures.includes(feature)}
                                onChange={handleCheckBoxChange}
                            />
                             <span className="add-venue-checkbox-custom"></span>
                            {feature}
                        </label>
                    ))}
                </section>
                <button 
                className="add-venue-button" 
                onClick={handleSubmit}>Add venue
            </button>
            </main>

            {/* AddPopup for confirmation */}
            {showConfirmationPopup && 
                <AddPopup 
                    type="confirmation" 
                    onConfirm={handleConfirm} 
                    onCancel={handleCancel} 
                />
            }

            {/* ConfirmPopup for success */}
            {showConfirmedPopup && 
                <ConfirmPopup 
                    type="confirmed" 
                    onClose={handleClose} 
                />
            }

            {/* InvalidPopup for errors */}
            {showInvalidPopup && 
                <InvalidPopup 
                    type="invalid" 
                    onClose={handleClose} 
                />
            }
            {/* Exisitng Venue Popup */}
            {showExistingVenuePopup &&
                <ExistingVenuePopup 
                    onClose={handleClose}
                />
            }
        </>
    );
}

export default AdminAddVenuePage;
