import React, { useState } from 'react';
import './BookingPage.css';
import headingIcon from '../../assets/icons/chevron-left.svg';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createBooking } from '../../services/BookingPage/BookingPage.service';

//Mock data
const data = {
  BUILDING_ID:1,
  BUILDING_NAME: "Mathematical Science Labs",
  VENUE_ID: 1,
  VENUE_NAME: "MSL001"
}

// Fetch function for getting venue details

const BookingPage = () => {
  const [eventReason, setEventReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // fetch building and venue name
  

  const handleSubmit = () => {
    const bookingData = {
      VENUE_ID: data.VENUE_ID,        // Get the venue ID
      USER_ID: "2623035@students.wits.ac.za",  // Hardcoded user ID for now
      DATE: "2024-09-12",  // Format the date to 'YYYY-MM-DD'
      START_TIME: "08:00:00",         // Example start time, can be dynamic
      END_TIME: "09:45:00",           // Example end time, can be dynamic
      DATE_CREATED:"2024-09-09",  // Date when the booking is created
      BOOKING_STATUS: "Confirmed",    // Example booking status
      
    };
    console.log("Booking Data:", bookingData);


    createBooking(bookingData)
    .then(() => {
     console.log("Booking Done")
    })
    .catch(() => {
     console.log("Booking Failed!")
    });
  

    };
 
  

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const displayedMonth = activeStartDate.getMonth();
      return date.getMonth() !== displayedMonth;
    }
    return false;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const displayedMonth = activeStartDate.getMonth();
      return date.getMonth() !== displayedMonth ? <div></div> : null;
    }
    return null;
  };

  return (
    <main className='booking-layout'>
      <article className='booking-heading'>
        <img src={headingIcon} alt='back-arrow' className='booking-icons' />
        <h1>Book Event</h1>
      </article>

      <section className='booking-container'>
        {/* Placeholder for Calendar */}
        <div className="calendar-placeholder">
          <Calendar
            onChange={setDate}
            value={date}
            onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            tileDisabled={tileDisabled}
            tileContent={tileContent}
            showNeighboringMonth={false} // Removes neighboring month's days
            prev2Label={null}  // Disable the previous year arrow
            next2Label={null}  // Disable the next year arrow
          />
        </div>

        {/* Booking Form */}
        <div className="booking-form">
          <input
            type="text"
            placeholder="Reason for booking"
            value={eventReason}
            onChange={(e) => setEventReason(e.target.value)}
            className="input-field"
          />
            <>
              <div className="predefined-field">{data.BUILDING_NAME}</div>
              <div className="predefined-field">{data.VENUE_NAME}</div>
            </>
          

          <div className="predefined-field">
            Time Slot
          </div>
          <button className="book-button" onClick={handleSubmit}>
            Book event
          </button>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;
