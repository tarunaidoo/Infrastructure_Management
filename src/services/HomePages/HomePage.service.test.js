import { fetchBooking, fetchVenue, fetchBuilding, deleteBooking } from './HomePage.service';

// Mock the fetch API globally
global.fetch = jest.fn();

describe("Building, Venue, and Booking Services", () => {
    beforeEach(() => {
        jest.resetAllMocks(); // Reset mocks before each test
    });

    // Tests for fetchBuilding
    describe("fetchBuilding", () => {
        it("should return building data when fetch is successful", async () => {
            const mockBuildingData = { value: [{ BUILDING_ID: 1, BUILDING_NAME: "Building A" }] };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockBuildingData),
            });

            const result = await fetchBuilding();
            expect(result).toEqual([{ BUILDING_ID: 1, BUILDING_NAME: "Building A" }]);
            expect(fetch).toHaveBeenCalledWith("/data-api/rest/BUILDING/");
        });

        it("should return null when building data is not an array", async () => {
            const mockBuildingData = { value: { BUILDING_ID: 1, BUILDING_NAME: "Building A" } };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockBuildingData),
            });

            const result = await fetchBuilding();
            expect(result).toBeNull();
            expect(fetch).toHaveBeenCalledWith("/data-api/rest/BUILDING/");
        });

        it("should return an empty array when building data is an empty array", async () => {
            const mockBuildingData = { value: [] };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockBuildingData),
            });

            const result = await fetchBuilding();
            expect(result).toEqual([]);
            expect(fetch).toHaveBeenCalledWith("/data-api/rest/BUILDING/");
        });
    });

    // Tests for fetchVenue
    describe("fetchVenue", () => {
        it("should return venue data when fetch is successful", async () => {
            const mockVenueData = { value: [{ VENUE_ID: 1, VENUE_NAME: "Venue A" }] };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockVenueData),
            });

            const result = await fetchVenue();
            expect(result).toEqual([{ VENUE_ID: 1, VENUE_NAME: "Venue A" }]);
            expect(fetch).toHaveBeenCalledWith("/data-api/rest/VENUE/");
        });

        it("should return null when venue data is not an array", async () => {
            const mockVenueData = { value: { VENUE_ID: 1, VENUE_NAME: "Venue A" } };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockVenueData),
            });

            const result = await fetchVenue();
            expect(result).toBeNull();
            expect(fetch).toHaveBeenCalledWith("/data-api/rest/VENUE/");
        });

        it("should return an empty array when venue data is an empty array", async () => {
            const mockVenueData = { value: [] };

            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValueOnce(mockVenueData),
            });

            const result = await fetchVenue();
            expect(result).toEqual([]);
            expect(fetch).toHaveBeenCalledWith("/data-api/rest/VENUE/");
        });
    });

    // Test for fetchBooking
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

    // Test for deleteBooking
    it("should delete a booking with a given booking ID", async () => {
        // Mock the fetch response for delete operation
        fetch.mockResolvedValueOnce({
            ok: true,
        });

        const bookingID = 1;
        await deleteBooking(bookingID);

        // Assert that the fetch was called with the correct endpoint and DELETE method
        expect(fetch).toHaveBeenCalledWith(`/data-api/rest/BOOKING/BOOKING_ID/1`, {
            method: "DELETE",
        });
        expect(fetch).toHaveBeenCalledTimes(1); // Ensure it was called exactly once
    });

    it("should handle failure when deleting a booking", async () => {
        // Mock a failed fetch response for delete operation
        fetch.mockResolvedValueOnce({
            ok: false,
            text: jest.fn().mockResolvedValueOnce('Delete failed'),
        });

        const bookingID = 2;
        await deleteBooking(bookingID);

        // Assert that the fetch was called with the correct endpoint and DELETE method
        expect(fetch).toHaveBeenCalledWith(`/data-api/rest/BOOKING/BOOKING_ID/2`, {
            method: "DELETE",
        });

        // Verify fetch is called even in case of failure
        expect(fetch).toHaveBeenCalledTimes(1);
    });
});
