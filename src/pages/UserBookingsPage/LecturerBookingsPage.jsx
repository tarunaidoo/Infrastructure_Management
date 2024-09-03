import React from "react";
import Header from '../../components/NavigationHeader/NavigationHeader';
import BookedEventsCard from '../../components/BookedEventsCards/BookedEventsCards';

function LecturerBookingPage() {
    // Define the event details
    const eventDetails = {
        title: 'Math Lecture',
        studentName: 'John Doe',
        date: 'Sep 10, 2024',
        time: '10:00 AM',
        venue: 'Main Hall',
        room: 'Room 101',
    };

    return (
        <>
            <Header title={"Lecturer Bookings"} />
            {/* Pass the eventName and eventDetails as props to BookedEventsCard */}
            <BookedEventsCard eventName="Math Lecture" eventDetails={eventDetails} />
        </>
    );
}

export default LecturerBookingPage;
