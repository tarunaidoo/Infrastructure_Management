import React, { useState } from 'react';
import './BookingPage.css';
import headingIcon from '../../assets/icons/chevron-left.svg';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { createBooking } from '../../services/BookingPage/BookingPage.service';
import "./Calendar.css";

// Mock data
const data = {
  BUILDING_ID: 1,
  BUILDING_NAME: "Mathematical Science Labs",
  VENUE_ID: 1,
  VENUE_NAME: "MSL001"
};

// Predefined time slots
const timeSlots = [
  { start: "08:00:00", end: "09:45:00" },
  { start: "10:00:00", end: "11:45:00" },
  { start: "12:00:00", end: "13:45:00" },
  { start: "14:00:00", end: "15:45:00" },
  { start: "16:00:00", end: "17:45:00" }
];

const BookingPage = () => {


  
  const [eventReason, setEventReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');  // Start with empty selection

  const handleSubmit = () => {
    if (!selectedTimeSlot) {
      alert("Please select a time slot");
      return;
    }

    const bookingData = {
      VENUE_ID: data.VENUE_ID,        // Get the venue ID
      USER_ID: "2623035@students.wits.ac.za",  // Hardcoded user ID for now
      DATE: date.toISOString().split('T')[0],  // Format the date to 'YYYY-MM-DD'
      START_TIME: selectedTimeSlot.start,      // Selected start time
      END_TIME: selectedTimeSlot.end,          // Selected end time
      DATE_CREATED: new Date().toISOString().split('T')[0],  // Date when the booking is created
      BOOKING_STATUS: "Confirmed"              // Example booking status
    };

    console.log("Booking Data:", bookingData);

    createBooking(bookingData)
      .then(() => {
        console.log("Booking Done");
      })
      .catch(() => {
        console.log("Booking Failed!");
      });
  };

  const handleTimeSlotChange = (e) => {
    const index = e.target.value;
    if (index !== "") {
      setSelectedTimeSlot(timeSlots[index]);
    }
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

          {/* Time Slot Dropdown */}
          <div className="predefined-field">
           
            <select value={selectedTimeSlot ? timeSlots.indexOf(selectedTimeSlot) : ''} onChange={handleTimeSlotChange}>
              <option value="">Time Slot</option> {/* Placeholder option */}
              {timeSlots.map((slot, index) => (
                <option key={index} value={index}>
                  {`${slot.start} - ${slot.end}`}
                </option>
              ))}
            </select>
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
