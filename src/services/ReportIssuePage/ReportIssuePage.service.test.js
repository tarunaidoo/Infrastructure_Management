import { createReportIssue } from "./ReportIssuePage.service";

// Mock the fetch API
global.fetch = jest.fn();

describe('createReportIssue', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should successfully send a report and log the result', async () => {
        const mockData = { key: 'value' };
        const mockResponse = { value: 'Success' };
        
        // Mock a successful fetch response
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        // Mock console.table to observe its call
        console.table = jest.fn();

        await createReportIssue(mockData);

        expect(fetch).toHaveBeenCalledWith('/data-api/rest/MAINTENANCE_ISSUE', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockData),
        });
        expect(console.table).toHaveBeenCalledWith(mockResponse.value);
    });

    it('should handle errors correctly', async () => {
        const mockData = { key: 'value' };
        const mockError = 'Failed to send report';
        
        // Mock a failed fetch response
        fetch.mockResolvedValueOnce({
            ok: false,
            text: async () => mockError,
        });

        // Mock console.error to observe its call
        console.error = jest.fn();

        await createReportIssue(mockData);

        expect(fetch).toHaveBeenCalledWith('/data-api/rest/MAINTENANCE_ISSUE', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockData),
        });
        expect(console.error).toHaveBeenCalledWith('Error:', new Error(`Failed to send report: ${mockError}`));
    });
});