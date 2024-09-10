import { getBuildingsFromCampus, getBuildingTagsIDFromBuildingID, getBuildingTagNamesForBuildings } from "./BuildingSelectionPage.service";

// Mock the fetch API
global.fetch = jest.fn();

describe("Building Selection Page Services", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should return correct buildings from the campus", async () => {
        // Mock data that the fetch API will return
        const mockBuildingsData = {
            value: [
                { BUILDING_ID: 1, BUILDING_NAME: "Building A", BUILDING_LOCATION: "West Campus" },
                { BUILDING_ID: 2, BUILDING_NAME: "Building B", BUILDING_LOCATION: "East Campus" },
                { BUILDING_ID: 3, BUILDING_NAME: "Building C", BUILDING_LOCATION: "West Campus" },
                { BUILDING_ID: 4, BUILDING_NAME: "Building D", BUILDING_LOCATION: "East Campus" },
            ],
        };

        // Set up the mock fetch response
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockBuildingsData),
        });

        // Call the function and pass the campus you want to filter
        const campus = "West Campus";
        const result = await getBuildingsFromCampus(campus);

        // Check if the function returns only the buildings from "West Campus"
        expect(result).toEqual([
            { BUILDING_ID: 1, BUILDING_NAME: "Building A", BUILDING_LOCATION: "West Campus" },
            { BUILDING_ID: 3, BUILDING_NAME: "Building C", BUILDING_LOCATION: "West Campus" },
        ]);

        // Ensure the fetch was called with the correct endpoint
        expect(fetch).toHaveBeenCalledWith("data-api/rest/BUILDING/");
    });

    it("should return correct tags for the building ID", async () => {
        // Mock data that the fetch API will return
        const mockTagsData = {
            value: [
                { TAG_ID: 1, BUILDING_ID: 1},
                { TAG_ID: 2, BUILDING_ID: 2},
                { TAG_ID: 3, BUILDING_ID: 1},
            ],
        };

        // Set up the mock fetch response
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValueOnce(mockTagsData),
        });

        // Call the function and pass the building ID
        const buildingID = 1;
        const result = await getBuildingTagsIDFromBuildingID(buildingID);

        // Check if the function returns only the tags for the given building ID
        expect(result).toEqual([
            { TAG_ID: 1, BUILDING_ID: 1},
            { TAG_ID: 3, BUILDING_ID: 1},
        ]);

        // Ensure the fetch was called with the correct endpoint
        expect(fetch).toHaveBeenCalledWith("data-api/rest/BUILDING_TAG/");
    });
});