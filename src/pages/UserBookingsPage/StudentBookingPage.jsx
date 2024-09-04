import React from "react";
import Header from '../../components/NavigationHeader/NavigationHeader';
import BookedEventsCard from '../../components/BookedEventsCards/BookedEventsCards';

function StudentBookingPage(){
    // Define the event details
    const eventDetails = {
        title: 'CGV Tutoring',
        studentName: 'John Doe',
        date: 'Sep 10, 2024',
        time: '10:00 AM',
        venue: 'Main Hall',
        room: 'Room 101',
    };

    return(
        <>
        <Header title={"Student Bookings"}/>
         {/* Pass the eventName and eventDetails as props to BookedEventsCard */}
         <BookedEventsCard eventName="Math Lecture" eventDetails={eventDetails} />
        </>
    );
}

export default StudentBookingPage;