import { formatDateToISO } from "../dateUtils";


const convertTo24HourFormat = (time12h) => {
    // Split the time into [time, modifier]
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert to 24-hour format
    if (modifier === "PM" && hours !== 12) {
        hours += 12;
    }
    if (modifier === "AM" && hours === 12) {
        hours = 0;
    }

    // Format hours and minutes to always be two digits
    const hours24 = hours.toString().padStart(2, "0");
    const minutes24 = minutes.toString().padStart(2, "0");

    return `${hours24}:${minutes24}`;
}


const getEndTime = (startTime, durationMinutes) => {
    // Parse the start time in "HH:mm" format
    let [hours, minutes] = startTime.split(":").map(Number);

    // Create a Date object and set the parsed hours and minutes
    const date = new Date();
    date.setHours(hours, minutes);

    // Add the duration in minutes
    date.setMinutes(date.getMinutes() + durationMinutes);

    // Format the new time back to "HH:mm" 24-hour format
    const endHours = date.getHours().toString().padStart(2, "0");
    const endMinutes = date.getMinutes().toString().padStart(2, "0");

    return `${endHours}:${endMinutes}`;
}


const formatTutoringBookings = (tutoringBookings) => {
    const inPersonBookings = tutoringBookings.filter((booking) => booking.meetingType === "In-person");
    
    const formattedBookings =  inPersonBookings.map((booking) => {
        const formattedBooking = {
            EVENT_NAME: `Tutoring Booking - ${booking.subject}`,
            VENUE_NAME: "MSL006",
            DATE: formatDateToISO(new Date(booking.sessionDate)),
            START_TIME: convertTo24HourFormat(booking.sessionTime),
            END_TIME: getEndTime(convertTo24HourFormat(booking.sessionTime), booking.duration)
        }
        return formattedBooking;
    });

    return formattedBookings;
}


const convertToDateObject = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day);
}


const formatEventBookings = (eventsBookings) => {
    const formattedBookings =  eventsBookings.map((booking) => {
        const formattedBooking = {
            EVENT_NAME: `Events Booking - ${booking.title}`,
            VENUE_NAME: booking.location,
            DATE: formatDateToISO(convertToDateObject(booking.date)),
            START_TIME: booking.startTime,
            END_TIME: booking.endTime
        };

        return formattedBooking;
    });

    return formattedBookings;
};


const filterBookingsByVenueIDAndDate = (bookings, venueID, date) => {
    // Filter bookings by VENUE_ID & DATE
    const filtredData = bookings.filter(row => (row.VENUE_ID === venueID && row.DATE === date));
    return filtredData;
}

const filterBookingsByVenueNameAndDate = (bookings, venueName, date) => {
    // Filter bookings by VENUE_NAME & DATE
    const filtredData = bookings.filter(row => (row.VENUE_NAME === venueName && row.DATE === date));
    return filtredData;
}

// Utility function to check if two time intervals overlap
const isOverlapping = (existingStart, existingEnd, newStart, newEnd) => {
    // Check if new interval overlaps with the existing one
    return newStart < existingEnd && newEnd > existingStart;
};


// Function to check for overlaps
const checkForTimeClash = (bookings, eventsBookings, tutoringBookings, venueID, venueName, date, newStartTime, newEndTime) => {
    const filteredBookings = filterBookingsByVenueIDAndDate(bookings, venueID, date);
    const filteredEventsBookings = filterBookingsByVenueNameAndDate(eventsBookings, venueName, date);
    const filteredTutoringBookings = filterBookingsByVenueNameAndDate(tutoringBookings, venueName, date);

    // Convert new booking times to timestamps
    const newStart = new Date(`1970-01-01T${newStartTime}`).getTime();
    const newEnd = new Date(`1970-01-01T${newEndTime}`).getTime();

    const allBookings = [...filteredBookings, ...filteredEventsBookings, ...filteredTutoringBookings];

    const overlappingBooking = allBookings.find(booking => {
        const existingStart = new Date(`1970-01-01T${booking.START_TIME}`).getTime();
        const existingEnd = new Date(`1970-01-01T${booking.END_TIME}`).getTime();
        return isOverlapping(existingStart, existingEnd, newStart, newEnd);
    });

   return overlappingBooking
        ? { isOverlapping: true, booking: overlappingBooking }
        : { isOverlapping: false, booking: null };
}


export { 
    filterBookingsByVenueNameAndDate, filterBookingsByVenueIDAndDate, isOverlapping, 
    checkForTimeClash, convertTo24HourFormat, convertToDateObject, formatEventBookings, 
    formatTutoringBookings, getEndTime 
};
