import React, { useState } from 'react';
import './BookingPage.css';
import NavigationHeader from '../../components/NavigationHeader/NavigationHeader';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BookingPage = () => {
  const [eventReason, setEventReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const handleSubmit = () => {
    alert("Event booked!");
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
    <>
      <NavigationHeader title="Book Event" />
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
        <div className="predefined-field">
          Mathematical Science Labs
        </div>
        <div className="predefined-field">
          MSL004
        </div>
        <div className="predefined-field">
          Time Slot
        </div>
        <button className="book-button" onClick={handleSubmit}>
          Book event
        </button>
      </div>
    </>
  );
};

export default BookingPage;
