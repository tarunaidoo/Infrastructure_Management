import { getBuilding, getVenue, getFeatures, getFeatureNames, updateVenue } from "./AdminEditVenuePage.service";

// Mock the fetch API
global.fetch = jest.fn();

afterEach(() => {
    jest.resetAllMocks();
});

describe('API Functions', () => {
    it('should return building data when building is found', async () => {
        const mockResponse = {
            value: [
                { BUILDING_ID: '1', BUILDING_NAME: 'Mathematical Science Labs' }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const buildingData = await getBuilding('Mathematical Science Labs');

        expect(buildingData).toEqual({
            building_id: '1',
            building_name: 'Mathematical Science Labs'
        });
    });

    it('should return null when building is not found', async () => {
        const mockResponse = { value: [] };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const buildingData = await getBuilding('Nonexistent Building');

        expect(buildingData).toBeNull();
    });

    it('should handle errors when fetching building data', async () => {
        // Mock a failed fetch response
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => { throw new Error('Network error'); },  // Ensure `json` throws an error
        });
    
        await expect(getBuilding('Mathematical Science Labs')).rejects.toThrow('Network error');
    });

    it('should return venue data when venue is found', async () => {
        const mockResponse = {
            value: [
                {
                    VENUE_ID: '1',
                    VENUE_NAME: 'MSL004',
                    BUILDING_ID: '1',
                    VENUE_CAPACITY: 250,
                    VENUE_STATUS: 'Unavailable'
                }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const venueData = await getVenue('MSL004');

        expect(venueData).toEqual({
            venue_id: '1',
            venue_name: 'MSL004',
            venue_capacity: 250,
            venue_status: 'Unavailable'
        });
    });

    it('should return null when venue is not found', async () => {
        const mockResponse = { value: [] };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const venueData = await getVenue('Nonexistent Venue');

        expect(venueData).toBeNull();
    });

    it('should handle errors when fetching venue data', async () => {
        // Mock a fetch response that will fail when calling response.json()
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => { throw new Error('Network error'); },  // Ensure `json` throws an error
        });
    
        await expect(getVenue('MSL004')).rejects.toThrow('Network error');
    });

    it('getFeatureNames should return all features with correct names', async () => {
        const mockResponse = {
            value: [
                { FEATURE_ID: '1', FEATURE_NAME: 'Computers' },
                { FEATURE_ID: '2', FEATURE_NAME: 'Desks' },
                { FEATURE_ID: '3', FEATURE_NAME: 'Chairs' },
                { FEATURE_ID: '4', FEATURE_NAME: 'Projector' },
                { FEATURE_ID: '5', FEATURE_NAME: 'Chalk Board' },
                { FEATURE_ID: '6', FEATURE_NAME: 'White Board' }
            ]
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const featureNames = await getFeatureNames();

        expect(featureNames).toEqual([
            { FEATURE_ID: '1', FEATURE_NAME: 'Computers' },
            { FEATURE_ID: '2', FEATURE_NAME: 'Desks' },
            { FEATURE_ID: '3', FEATURE_NAME: 'Chairs' },
            { FEATURE_ID: '4', FEATURE_NAME: 'Projector' },
            { FEATURE_ID: '5', FEATURE_NAME: 'Chalk Board' },
            { FEATURE_ID: '6', FEATURE_NAME: 'White Board' }
        ]);
    });

    it('getFeatures should return features associated with a venue', async () => {
        const mockResponse = {
            value: [
                { ROOM_FEATURE_ID: '10', FEATURE_ID: '6', VENUE_ID: 'V1' },
                { ROOM_FEATURE_ID: '11', FEATURE_ID: '1', VENUE_ID: 'V1' }
            ]
        };
    
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });
    
        const featureData = await getFeatures('V1');
    
        expect(featureData).toEqual({
            featureDetails: [
                { ROOM_FEATURE_ID: '10', FEATURE_ID: '6' },
                { ROOM_FEATURE_ID: '11', FEATURE_ID: '1' }
            ]
        });
    });

    it('getFeatures should handle no features found for a venue', async () => {
        const mockResponse = { value: [] };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const featureData = await getFeatures('NonexistentVenue');

        expect(featureData).toBeNull();
    });
    it('should update venue data successfully', async () => {
        const mockData = { venue_name: 'Updated Venue', venue_capacity: 300 };
        const venueId = '1';
        const mockResponse = { success: true };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
            status: 200 // Mock status for successful response
        });

        const result = await updateVenue(mockData, venueId);

        expect(fetch).toHaveBeenCalledWith(`/data-api/rest/VENUE/VENUE_ID/${venueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockData),
        });

        expect(result).toEqual(mockResponse);
    });

    it('should handle HTTP errors when updating venue data', async () => {
        const mockData = { venue_name: 'Updated Venue', venue_capacity: 300 };
        const venueId = '1';
        const mockErrorResponse = { error: 'Update failed' };

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => mockErrorResponse,
            status: 500 // Mock status for error response
        });

        await expect(updateVenue(mockData, venueId)).rejects.toThrow(
            `Failed to update status for venue: ${venueId}. Status: 500, Error: ${JSON.stringify(mockErrorResponse)}`
        );
    });

    it('should handle errors in the response', async () => {
        const mockData = { venue_name: 'Updated Venue', venue_capacity: 300 };
        const venueId = '1';

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => { throw new Error('Response JSON error'); },
            status: 200
        });

        await expect(updateVenue(mockData, venueId)).rejects.toThrow('Response JSON error');
    });

    it('should handle network errors', async () => {
        const mockData = { venue_name: 'Updated Venue', venue_capacity: 300 };
        const venueId = '1';

        fetch.mockRejectedValueOnce(new Error('Network error'));

        await expect(updateVenue(mockData, venueId)).rejects.toThrow('Network error');
    });
    
});