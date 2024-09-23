import { createBooking, getBookings } from "./BookingPage.service";
import { formatDateToISO } from "../../utils/dateUtils";

// Mock the fetch API
global.fetch = jest.fn();

describe('createBooking', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
  });

  it('sends a POST request with the correct booking data and headers', async () => {
    const mockResponse = { ok: true };
    fetch.mockResolvedValueOnce(mockResponse);

    const bookingData = {
      VENUE_ID: 1,
      USER_ID: 123,
      EVENT_NAME: 'Sample Event',
      DATE: '2024-10-10',
      START_TIME: '10:00',
      END_TIME: '12:00',
      DATE_CREATED: formatDateToISO(new Date()),
      BOOKING_STATUS: 'Confirmed',
    };

    const response = await createBooking(bookingData);

    expect(fetch).toHaveBeenCalledWith('/data-api/rest/BOOKING', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    expect(response).toBe(mockResponse);
  });

  it('handles fetch error during booking creation', async () => {
    const errorMessage = 'Failed to create booking';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const bookingData = {
      VENUE_ID: 1,
      USER_ID: 123,
      EVENT_NAME: 'Error Event',
      DATE: '2024-10-10',
      START_TIME: '10:00',
      END_TIME: '12:00',
      DATE_CREATED: formatDateToISO(new Date()),
      BOOKING_STATUS: 'Confirmed',
    };

    try {
      await createBooking(bookingData);
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
  });
});

describe('getBookings', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks between tests
  });

  it('fetches bookings and returns the correct data', async () => {
    const mockBookingData = {
      value: [
        { id: 1, venueId: 1, eventName: 'Event 1', startTime: '10:00', endTime: '12:00' },
        { id: 2, venueId: 2, eventName: 'Event 2', startTime: '14:00', endTime: '16:00' },
      ],
    };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookingData,
    });

    const bookings = await getBookings();

    expect(fetch).toHaveBeenCalledWith('data-api/rest/BOOKING/');
    expect(bookings).toEqual(mockBookingData.value);
  });

  it('handles fetch error during bookings retrieval', async () => {
    const errorMessage = 'Network Error';
    fetch.mockRejectedValueOnce(new Error(errorMessage));

    const bookings = await getBookings();

    expect(fetch).toHaveBeenCalledWith('data-api/rest/BOOKING/');
    expect(bookings).toEqual([]); // Should return an empty array on error
  });
});
