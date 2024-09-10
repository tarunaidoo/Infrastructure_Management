import { getVenuesFromBuildingID, getVenueFeatureIDFromVenueID } from "./RoomSelectionPage.service";

// Mock the fetch API
global.fetch = jest.fn();

describe("Room Selection Page Services", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return correct rooms from the building ID", async () => {
        // Mock data that the fetch API will return
        const mockBuildingsData = {
            value: [
                {VENUE_ID: 1, BUILDING_ID: 1, VENUE_NAME:"MSL004"},
                {VENUE_ID: 2, BUILDING_ID: 1, VENUE_NAME:"MSL005"},
                {VENUE_ID: 3, BUILDING_ID: 1, VENUE_NAME:"MSL006"},
                {VENUE_ID: 4, BUILDING_ID: 2, VENUE_NAME:"WSS113"},
                {VENUE_ID: 5, BUILDING_ID: 2, VENUE_NAME:"WSS111"},
                {VENUE_ID: 6, BUILDING_ID: 2, VENUE_NAME:"WSS112"},
            ],
        };

        // Set up the mock fetch response
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockBuildingsData),
        });

        // Call the function and pass the campus you want to filter
        const buildingID = 2;
        const result = await getVenuesFromBuildingID(buildingID);

        // Check if the function returns only the buildings from "West Campus"
        expect(result).toEqual([
            {VENUE_ID: 4, BUILDING_ID: 2, VENUE_NAME:"WSS113"},
            {VENUE_ID: 5, BUILDING_ID: 2, VENUE_NAME:"WSS111"},
            {VENUE_ID: 6, BUILDING_ID: 2, VENUE_NAME:"WSS112"}
        ]);

        // Ensure the fetch was called with the correct endpoint
        expect(fetch).toHaveBeenCalledWith("data-api/rest/VENUE/");
    });

    it("should return correct feature ID for the venue ID", async () => {
        // Mock data that the fetch API will return
        const mockTagsData = {
            value: [
                {VENUE_ID: 1, FEATURE_ID: 1},
                {VENUE_ID: 1, FEATURE_ID: 2},
                {VENUE_ID: 1, FEATURE_ID: 3},
                {VENUE_ID: 2, FEATURE_ID: 3},
                {VENUE_ID: 2, FEATURE_ID: 4},
                {VENUE_ID: 2, FEATURE_ID: 6},
                {VENUE_ID: 3, FEATURE_ID: 1},
            ],
        };

        // Set up the mock fetch response
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockTagsData),
        });

        // Call the function and pass the building ID
        const venueID = 1;
        const result = await getVenueFeatureIDFromVenueID(venueID);

        // Check if the function returns only the tags for the given building ID
        expect(result).toEqual([
            {VENUE_ID: 1, FEATURE_ID: 1},
            {VENUE_ID: 1, FEATURE_ID: 2},
            {VENUE_ID: 1, FEATURE_ID: 3}
        ]);

        // Ensure the fetch was called with the correct endpoint
        expect(fetch).toHaveBeenCalledWith("data-api/rest/VENUE_FEATURES/");
    });
});