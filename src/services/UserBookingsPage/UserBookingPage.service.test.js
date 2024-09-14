import { fetchAllUsers, fetchAllBookings, fetchAllVenues } from './UserBookingPage.service';

// Mock the global fetch function
global.fetch = jest.fn();

afterEach(() => {
  jest.clearAllMocks(); // Clear mock after each test
});

describe('fetchAllUsers function', () => {
  it('should return all users when the API call is successful', async () => {
    const mockUsers = [
      { USER_ID: 'U123', FIRST_NAME: 'John', LAST_NAME: 'Doe', USER_ROLE: 'Student' },
      { USER_ID: 'U124', FIRST_NAME: 'Jane', LAST_NAME: 'Smith', USER_ROLE: 'Admin' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const result = await fetchAllUsers();
    expect(result).toEqual(mockUsers);
  });

  it('should throw an error when the API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchAllUsers()).rejects.toThrow('Failed to fetch users');
  });

  it('should throw an error when the fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchAllUsers()).rejects.toThrow('Network Error');
  });
});

describe('fetchAllBookings function', () => {
  it('should return all bookings when the API call is successful', async () => {
    const mockBookings = [
      {
        BOOKING_ID: 1,
        VENUE_ID: 1,
        USER_ID: 'U123',
        DATE: '2024-09-13',
        START_TIME: '10:00:00',
        END_TIME: '12:00:00',
        DATE_CREATED: '2024-09-12',
        BOOKING_STATUS: 'Confirmed',
      },
      {
        BOOKING_ID: 2,
        VENUE_ID: 2,
        USER_ID: 'U124',
        DATE: '2024-09-14',
        START_TIME: '11:00:00',
        END_TIME: '13:00:00',
        DATE_CREATED: '2024-09-13',
        BOOKING_STATUS: 'Pending',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookings,
    });

    const result = await fetchAllBookings();
    expect(result).toEqual(mockBookings);
  });

  it('should throw an error when the API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchAllBookings()).rejects.toThrow('Failed to fetch bookings');
  });

  it('should throw an error when the fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchAllBookings()).rejects.toThrow('Network Error');
  });
});

describe('fetchAllVenues function', () => {
  it('should return all venues when the API call is successful', async () => {
    const mockVenues = [
      {
        VENUE_ID: 1,
        BUILDING_ID: 1,
        VENUE_NAME: 'Auditorium',
        VENUE_CAPACITY: 200,
        VENUE_STATUS: 'Available',
      },
      {
        VENUE_ID: 2,
        BUILDING_ID: 1,
        VENUE_NAME: 'Lecture Hall',
        VENUE_CAPACITY: 100,
        VENUE_STATUS: 'Booked',
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockVenues,
    });

    const result = await fetchAllVenues();
    expect(result).toEqual(mockVenues);
  });

  it('should throw an error when the API call fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(fetchAllVenues()).rejects.toThrow('Failed to fetch venues');
  });

  it('should throw an error when the fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchAllVenues()).rejects.toThrow('Network Error');
  });
});
