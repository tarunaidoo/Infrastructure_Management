import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import headingIcon from '../../assets/icons/chevron-left.svg';
import Calendar from "react-calendar";
import { createBooking } from '../../services/BookingPage/BookingPage.service';
import Popup from '../../components/Popup/Popup';
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import './BookingPage.css';

// Mock data
// const data = {
//   BUILDING_ID: 1,
//   BUILDING_NAME: "Mathematical Science Labs",
//   VENUE_ID: 1,
//   VENUE_NAME: "MSL001"
// };

// Predefined time slots
const timeSlots = [
  { start: "08:00:00", end: "09:45:00" },
  { start: "10:00:00", end: "11:45:00" },
  { start: "12:00:00", end: "13:45:00" },
  { start: "14:00:00", end: "15:45:00" },
  { start: "16:00:00", end: "17:45:00" }
];

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVenue = location.state || {};
  
  const [eventReason, setEventReason] = useState('');
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');  // Start with empty selection
  const [popupState, setPopupState] = useState("");
  const [displayPopup, setDisplayPopup] = useState(false);

  const mutation = useMutation((newBooking) => createBooking(newBooking), {
        onSuccess: () => {
          setPopupState("Booking Successful");
          setDisplayPopup(true);
        },

        onError: () => {
          setPopupState("Booking Failed");
          setDisplayPopup(true);
        },

        onSettled: () => {
          // IDK, but might need it later :)
        }
      }
  );

  const handleSubmit = () => {
    if (selectedVenue == {} || !selectedTimeSlot) {
      setPopupState("Invalid Details");
      setDisplayPopup(true);
      return;
    }

    setPopupState("Confirm Booking");
    setDisplayPopup(true);
  };

  if (mutation.isLoading) {
    return <span>Submitting...</span>;
  }

  const handleOnVenueSelectionClick = () => {
    const venueSelectionDetails = {
      SOURCE_PAGE: "/booking",
      DESTINATION_PAGE: "/booking"
    }
    navigate("/campus-selection", { state: venueSelectionDetails });
  }

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

  const handleBackToVenueBookingClick = () => {
    setPopupState("");
    setDisplayPopup(false);
  }

  const handleConfirmBookingClick = () => {
    setPopupState("")
    setDisplayPopup(false);

    const bookingData = {
      VENUE_ID: selectedVenue.VENUE_ID,        // Get the venue ID
      USER_ID: selectedVenue.USER_ID,          // User ID
      DATE: date.toISOString().split('T')[0],  // Format the date to 'YYYY-MM-DD'
      START_TIME: selectedTimeSlot.start,      // Selected start time
      END_TIME: selectedTimeSlot.end,          // Selected end time
      DATE_CREATED: new Date().toISOString().split('T')[0],  // Date when the booking is created
      BOOKING_STATUS: "Confirmed"              // Example booking status
    };

    console.log("Booking Data:", bookingData);

    mutation.mutate(bookingData);
  }

  const handleBookingSuccessfulClick = () => {
    setDisplayPopup(false);

    navigate("/student-home");
  }

  console.log(popupState);

  return (
    <>
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
              <div onClick={handleOnVenueSelectionClick} className="predefined-field">
                {selectedVenue.BUILDING_NAME ? selectedVenue.BUILDING_NAME : "Choose a venue"}
              </div>
              <div className="predefined-field">
                {selectedVenue.VENUE_NAME}
              </div>
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

      {popupState === "Invalid Details" ?
        <Popup trigger={displayPopup}>
          <h2> Invalid Details </h2>
          <p> Please fill in all fields </p>
          <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
        </Popup>
      : ""}

      {popupState === "Confirm Booking" ?
        <Popup trigger={displayPopup}>
          <h2> Confirmation </h2>
          <p> Do you want to place a booking for this event? </p>
          <article className='confirm-booking-button-container'>
            <button onClick={handleConfirmBookingClick} className='booking-popup-button'>Yes</button> 
            <button onClick={handleBackToVenueBookingClick}className='booking-popup-button'>No</button>
          </article>
        </Popup>
      : ""}

      {popupState === "Booking Successful" ?
        <Popup trigger={displayPopup}>
          <h2> Confirmation </h2>
          <p> Your event has been booked! </p>
          <button onClick={handleBookingSuccessfulClick} className='booking-popup-button'>Close</button>
        </Popup>
      : ""}

      {popupState === "Booking Failed" ?
        <Popup trigger={displayPopup}>
          <h2> Booking Error </h2>
          <p> Failed to book your event! </p>
          <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
        </Popup>
      : ""}
    </>
  );
};

export default BookingPage;
