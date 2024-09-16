import { fetchBooking, fetchVenue, fetchBuilding } from "./HomePage.service";

// Mock the fetch API globally
global.fetch = jest.fn();

describe("Building and Venue Services", () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Reset mocks before each test
    });

    it("should return the correct building for a given building ID", async () => {
        const mockBuildingData = {
            value: [
                { BUILDING_ID: 1, BUILDING_NAME: "Building A" },
                { BUILDING_ID: 2, BUILDING_NAME: "Building B" }
            ]
        };

        // Mock the fetch response for building
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockBuildingData)
        });

        const buildingID = 1;
        const result = await fetchBuilding(buildingID);

        expect(result).toEqual({ BUILDING_ID: 1, BUILDING_NAME: "Building A" });
        expect(fetch).toHaveBeenCalledWith("/data-api/rest/BUILDING/");
    });

    it("should return null if building ID not found", async () => {
        const mockBuildingData = {
            value: [
                { BUILDING_ID: 1, BUILDING_NAME: "Building A" },
                { BUILDING_ID: 2, BUILDING_NAME: "Building B" }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockBuildingData)
        });

        const buildingID = 3; // Non-existent ID
        const result = await fetchBuilding(buildingID);

        expect(result).toBeNull();
        expect(fetch).toHaveBeenCalledWith("/data-api/rest/BUILDING/");
    });

    it("should return the correct venue for a given venue ID", async () => {
        const mockVenueData = {
            value: [
                { VENUE_ID: 1, VENUE_NAME: "Venue A" },
                { VENUE_ID: 2, VENUE_NAME: "Venue B" }
            ]
        };

        // Mock the fetch response for venue
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockVenueData)
        });

        const venueID = 1;
        const result = await fetchVenue(venueID);

        expect(result).toEqual({ VENUE_ID: 1, VENUE_NAME: "Venue A" });
        expect(fetch).toHaveBeenCalledWith("/data-api/rest/VENUE/");
    });

    it("should return null if venue ID not found", async () => {
        const mockVenueData = {
            value: [
                { VENUE_ID: 1, VENUE_NAME: "Venue A" },
                { VENUE_ID: 2, VENUE_NAME: "Venue B" }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockVenueData)
        });

        const venueID = 3; // Non-existent ID
        const result = await fetchVenue(venueID);

        expect(result).toBeNull();
        expect(fetch).toHaveBeenCalledWith("/data-api/rest/VENUE/");
    });

    it("should return the correct bookings for a given user ID", async () => {
        const mockBookingData = {
            value: [
                { BOOKING_ID: 1, USER_ID: 1, VENUE_ID: 1 },
                { BOOKING_ID: 2, USER_ID: 1, VENUE_ID: 2 },
                { BOOKING_ID: 3, USER_ID: 2, VENUE_ID: 1 }
            ]
        };

        // Mock the fetch response for booking
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockBookingData)
        });

        const userID = 1;
        const result = await fetchBooking(userID);

        expect(result).toEqual([
            { BOOKING_ID: 1, USER_ID: 1, VENUE_ID: 1 },
            { BOOKING_ID: 2, USER_ID: 1, VENUE_ID: 2 }
        ]);
        expect(fetch).toHaveBeenCalledWith("/data-api/rest/BOOKING/");
    });

    it("should return an empty array if no bookings found for the user", async () => {
        const mockBookingData = {
            value: [
                { BOOKING_ID: 1, USER_ID: 1, VENUE_ID: 1 },
                { BOOKING_ID: 2, USER_ID: 1, VENUE_ID: 2 }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockBookingData)
        });

        const userID = 3; // User ID with no bookings
        const result = await fetchBooking(userID);

        expect(result).toEqual([]);
        expect(fetch).toHaveBeenCalledWith("/data-api/rest/BOOKING/");
    });
});
