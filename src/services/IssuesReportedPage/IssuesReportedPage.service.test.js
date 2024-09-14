// IssuesReportedPage.service.test.js
import { fetchIssues, fetchVenues, updateAvailability } from './IssuesReportedPage.service.jsx';

global.fetch = jest.fn(); // Mock fetch

describe('IssuesReportedPage.service', () => {
    
    beforeEach(() => {
        fetch.mockClear();
    });

    // Test fetchIssues
    describe('fetchIssues', () => {
        it('fetches issues successfully', async () => {
            const mockIssuesResponse = {
                value: [
                    { ISSUE_ID: 1, description: 'Issue 1' },
                    { ISSUE_ID: 2, description: 'Issue 2' },
                ],
            };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockIssuesResponse,
            });

            const issues = await fetchIssues();
            expect(issues).toEqual(mockIssuesResponse.value);
            expect(fetch).toHaveBeenCalledWith('/data-api/rest/MAINTENANCE_ISSUE');
        });

        it('returns an empty array on error', async () => {
            fetch.mockRejectedValueOnce(new Error('API Error'));

            const issues = await fetchIssues();
            expect(issues).toEqual([]);
            expect(fetch).toHaveBeenCalledWith('/data-api/rest/MAINTENANCE_ISSUE');
        });
    });

    // Test fetchVenues
    describe('fetchVenues', () => {
        it('fetches venues successfully', async () => {
            const mockVenuesResponse = {
                value: [
                    { VENUE_ID: 1, VENUE_NAME: 'Venue 1' },
                    { VENUE_ID: 2, VENUE_NAME: 'Venue 2' },
                ],
            };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockVenuesResponse,
            });

            const venues = await fetchVenues();
            expect(venues).toEqual(mockVenuesResponse.value);
            expect(fetch).toHaveBeenCalledWith('/data-api/rest/VENUE');
        });

        it('returns an empty array on error', async () => {
            fetch.mockRejectedValueOnce(new Error('API Error'));

            const venues = await fetchVenues();
            expect(venues).toEqual([]);
            expect(fetch).toHaveBeenCalledWith('/data-api/rest/VENUE');
        });
    });

    // Test updateAvailability
    describe('updateAvailability', () => {
        it('updates the availability status of a venue successfully', async () => {
            const venueID = 1;
            const newStatus = 'AVAILABLE';
            const mockVenuesResponse = {
                value: [
                    { VENUE_ID: 1, VENUE_NAME: 'Venue 1', BUILDING_ID: 101, VENUE_CAPACITY: 50, VENUE_STATUS: 'OCCUPIED' },
                ],
            };
            const mockUpdateResponse = { success: true };

            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockVenuesResponse,
                }) // Mock fetchVenues
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockUpdateResponse,
                }); // Mock update request

            const result = await updateAvailability(venueID, newStatus);
            expect(result).toEqual(mockUpdateResponse);
            expect(fetch).toHaveBeenCalledWith('/data-api/rest/VENUE');
            expect(fetch).toHaveBeenCalledWith(`/data-api/rest/VENUE/VENUE_ID/${venueID}`, expect.objectContaining({
                method: 'PUT',
                body: JSON.stringify({
                    BUILDING_ID: 101,
                    VENUE_NAME: 'Venue 1',
                    VENUE_CAPACITY: 50,
                    VENUE_STATUS: newStatus,
                }),
            }));
        });

        it('throws an error if venue is not found', async () => {
            const venueID = 999;
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ value: [] }),
            }); // Mock fetchVenues to return no venues

            await expect(updateAvailability(venueID, 'AVAILABLE')).rejects.toThrow(`Venue with ID ${venueID} not found`);
        });

        it('handles errors during update', async () => {
            const venueID = 1;
            const newStatus = 'AVAILABLE';
            const mockVenuesResponse = {
                value: [
                    { VENUE_ID: 1, VENUE_NAME: 'Venue 1', BUILDING_ID: 101, VENUE_CAPACITY: 50, VENUE_STATUS: 'OCCUPIED' },
                ],
            };

            fetch
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockVenuesResponse,
                }) // Mock fetchVenues
                .mockResolvedValueOnce({
                    ok: false,
                    status: 500,
                    json: async () => ({ error: 'Internal Server Error' }),
                }); // Mock failed update

            await expect(updateAvailability(venueID, newStatus)).rejects.toThrow('Failed to update status for venue');
        });
    });
});
