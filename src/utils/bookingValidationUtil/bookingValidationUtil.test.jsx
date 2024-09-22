import { filterBookingsByVenueIDAndDate, isOverlapping, checkForTimeClash } from "./bookingValidationUtil"; // Adjust the import path

describe('filterBookingsByVenueIDAndDate', () => {
  it('should filter bookings by venue ID and date', () => {
    const bookings = [
      { VENUE_ID: 1, DATE: '2024-09-20', START_TIME: '10:00', END_TIME: '12:00' },
      { VENUE_ID: 2, DATE: '2024-09-20', START_TIME: '14:00', END_TIME: '16:00' },
      { VENUE_ID: 1, DATE: '2024-09-21', START_TIME: '10:00', END_TIME: '12:00' },
    ];

    const filtered = filterBookingsByVenueIDAndDate(bookings, 1, '2024-09-20');
    
    expect(filtered).toEqual([
      { VENUE_ID: 1, DATE: '2024-09-20', START_TIME: '10:00', END_TIME: '12:00' },
    ]);
  });

  it('should return an empty array if no bookings match the venue ID and date', () => {
    const bookings = [
      { VENUE_ID: 2, DATE: '2024-09-20', START_TIME: '10:00', END_TIME: '12:00' },
    ];

    const filtered = filterBookingsByVenueIDAndDate(bookings, 1, '2024-09-20');
    
    expect(filtered).toEqual([]);
  });
});

describe('isOverlapping', () => {
  it('should return true when time intervals overlap', () => {
    const result = isOverlapping(
      new Date('1970-01-01T10:00').getTime(),
      new Date('1970-01-01T12:00').getTime(),
      new Date('1970-01-01T11:00').getTime(),
      new Date('1970-01-01T13:00').getTime()
    );

    expect(result).toBe(true);
  });

  it('should return false when time intervals do not overlap', () => {
    const result = isOverlapping(
      new Date('1970-01-01T10:00').getTime(),
      new Date('1970-01-01T12:00').getTime(),
      new Date('1970-01-01T12:00').getTime(),
      new Date('1970-01-01T14:00').getTime()
    );

    expect(result).toBe(false);
  });
});

describe('checkForTimeClash', () => {
  it('should return true when a new booking overlaps with an existing booking', () => {
    const bookings = [
      { VENUE_ID: 1, DATE: '2024-09-20', START_TIME: '10:00', END_TIME: '12:00' },
    ];

    const result = checkForTimeClash(bookings, 1, '2024-09-20', '11:00', '13:00');
    expect(result).toBe(true);
  });

  it('should return false when a new booking does not overlap with any existing bookings', () => {
    const bookings = [
      { VENUE_ID: 1, DATE: '2024-09-20', START_TIME: '10:00', END_TIME: '12:00' },
    ];

    const result = checkForTimeClash(bookings, 1, '2024-09-20', '12:00', '14:00');
    expect(result).toBe(false);
  });

  it('should return false if there are no bookings on the given date and venue', () => {
    const bookings = [
      { VENUE_ID: 1, DATE: '2024-09-21', START_TIME: '10:00', END_TIME: '12:00' },
    ];

    const result = checkForTimeClash(bookings, 1, '2024-09-20', '10:00', '12:00');
    expect(result).toBe(false);
  });
});
