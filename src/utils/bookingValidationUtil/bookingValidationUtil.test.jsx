import { 
  convertTo24HourFormat, 
  getEndTime, 
  formatTutoringBookings, 
  formatEventBookings, 
  filterBookingsByVenueIDAndDate, 
  filterBookingsByVenueNameAndDate, 
  isOverlapping, 
  checkForTimeClash 
} from './bookingValidationUtil';

import { formatDateToISO } from '../dateUtils';


describe('convertTo24HourFormat', () => {
  test('converts AM time correctly', () => {
      expect(convertTo24HourFormat("07:30 AM")).toBe("07:30");
      expect(convertTo24HourFormat("12:00 AM")).toBe("00:00");
  });
  
  test('converts PM time correctly', () => {
      expect(convertTo24HourFormat("01:15 PM")).toBe("13:15");
      expect(convertTo24HourFormat("12:45 PM")).toBe("12:45");
  });
});

describe('getEndTime', () => {
  test('calculates end time correctly with minute duration', () => {
      expect(getEndTime("13:00", 90)).toBe("14:30");
      expect(getEndTime("23:30", 60)).toBe("00:30");  // Wrap around midnight
  });
});

describe('formatTutoringBookings', () => {
  const mockBookings = [
      { meetingType: "In-person", subject: "Math", sessionDate: "2024-10-01", sessionTime: "03:00 PM", duration: 60 },
      { meetingType: "Online", subject: "Science", sessionDate: "2024-10-01", sessionTime: "02:00 PM", duration: 30 }
  ];
  
  test('filters and formats tutoring bookings correctly', () => {
      const formatted = formatTutoringBookings(mockBookings);
      expect(formatted).toEqual([{
          EVENT_NAME: "Tutoring Booking - Math",
          VENUE_NAME: "MSL006",
          DATE: formatDateToISO(new Date("2024-10-01")),
          START_TIME: "15:00",
          END_TIME: "16:00"
      }]);
  });
});

describe('formatEventBookings', () => {
  const mockEvents = [
      { title: "Art Class", location: "Art Room", date: "10/01/2024", startTime: "10:00", endTime: "11:30" }
  ];
  
  test('formats event bookings correctly', () => {
      const formatted = formatEventBookings(mockEvents);
      expect(formatted).toEqual([{
          EVENT_NAME: "Events Booking - Art Class",
          VENUE_NAME: "Art Room",
          DATE: formatDateToISO(new Date(2024, 0, 10)),
          START_TIME: "10:00",
          END_TIME: "11:30"
      }]);
  });
});

describe('filterBookingsByVenueIDAndDate', () => {
  const mockBookings = [
      { VENUE_ID: 1, DATE: "2024-10-01", EVENT_NAME: "Event 1" },
      { VENUE_ID: 2, DATE: "2024-10-01", EVENT_NAME: "Event 2" }
  ];

  test('filters bookings by venue ID and date', () => {
      expect(filterBookingsByVenueIDAndDate(mockBookings, 1, "2024-10-01")).toEqual([{ VENUE_ID: 1, DATE: "2024-10-01", EVENT_NAME: "Event 1" }]);
  });
});

describe('filterBookingsByVenueNameAndDate', () => {
  const mockBookings = [
      { VENUE_NAME: "Main Hall", DATE: "2024-10-01", EVENT_NAME: "Event 1" },
      { VENUE_NAME: "Room A", DATE: "2024-10-01", EVENT_NAME: "Event 2" }
  ];

  test('filters bookings by venue name and date', () => {
      expect(filterBookingsByVenueNameAndDate(mockBookings, "Main Hall", "2024-10-01")).toEqual([{ VENUE_NAME: "Main Hall", DATE: "2024-10-01", EVENT_NAME: "Event 1" }]);
  });
});

describe('isOverlapping', () => {
  test('detects overlapping times', () => {
      expect(isOverlapping(1000, 2000, 1500, 2500)).toBe(true);
  });

  test('detects non-overlapping times', () => {
      expect(isOverlapping(1000, 2000, 2000, 3000)).toBe(false);
  });
});


describe('checkForTimeClash', () => {
  const mockBookings = [
      { VENUE_ID: 1, VENUE_NAME: "Main Hall", DATE: "2024-10-01", START_TIME: "10:00", END_TIME: "11:00" },
  ];
  const mockEventBookings = [
      { VENUE_NAME: "Main Hall", DATE: "2024-10-01", START_TIME: "12:00", END_TIME: "13:00" }
  ];
  const mockTutoringBookings = [
      { VENUE_NAME: "Main Hall", DATE: "2024-10-01", START_TIME: "09:00", END_TIME: "10:30" }
  ];

  test('detects no clash when no overlapping bookings', () => {
      const result = checkForTimeClash(mockBookings, mockEventBookings, mockTutoringBookings, 1, "Main Hall", "2024-10-01", "14:00", "15:00");
      expect(result.isOverlapping).toBe(false);
  });

  test('detects clash when overlapping with an existing booking', () => {
      const result = checkForTimeClash(mockBookings, mockEventBookings, mockTutoringBookings, 1, "Main Hall", "2024-10-01", "10:30", "11:30");
      expect(result.isOverlapping).toBe(true);
      expect(result.booking).toEqual(mockBookings[0]);
  });
});
