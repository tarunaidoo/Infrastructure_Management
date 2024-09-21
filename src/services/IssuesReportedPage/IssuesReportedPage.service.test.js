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

});
