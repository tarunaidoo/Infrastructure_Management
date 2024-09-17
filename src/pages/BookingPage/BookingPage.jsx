import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import headingIcon from '../../assets/icons/chevron-left.svg';
import Calendar from "react-calendar";
import { createBooking, checkForOverlap } from '../../services/BookingPage/BookingPage.service';
import Popup from '../../components/Popup/Popup';
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import './BookingPage.css';

// Predefined time slots
const timeSlots = [
  { start: "08:00:00", end: "09:45:00" },
  { start: "10:00:00", end: "11:45:00" },
  { start: "12:00:00", end: "13:45:00" },
  { start: "14:00:00", end: "15:45:00" },
  { start: "16:00:00", end: "17:45:00" }
];

const BookingPage = () => {
  const userID = localStorage.getItem('userEmail'); // get userID
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVenue = location.state || {};
  
  const [eventName, setEventName] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [popupState, setPopupState] = useState("");
  const [displayPopup, setDisplayPopup] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(false); // Hide loading state after mutation is done
    }
  });

  const handleSubmit = async () => {
    if (!selectedVenue || !selectedTimeSlot) {
      setPopupState("Invalid Details");
      setDisplayPopup(true);
      return;
    }
  
    const newStartTime = selectedTimeSlot.start;
    const newEndTime = selectedTimeSlot.end;
  
    // Normalize booking date to midnight to avoid timezone issues
    const normalizedDate = new Date(bookingDate);
    normalizedDate.setHours(0, 0, 0, 0);
  
    setLoading(true); // Show loading state while fetching bookings
  
    try {
      const overlapExists = await checkForOverlap(
        selectedVenue.VENUE_ID,
        normalizedDate.toISOString().split('T')[0], // Use only the date part
        newStartTime,
        newEndTime
      );
      console.log(overlapExists);
      if (overlapExists) {
        setPopupState("Time Slot Overlap");
        setDisplayPopup(true);
        return;
      }
  
      setPopupState("Confirm Booking");
      setDisplayPopup(true);
    } catch (error) {
      console.error("Error during booking process:", error);
      setPopupState("Error");
      setDisplayPopup(true);
    } finally {
      setLoading(false); // Hide loading state after checking for overlap
    }
  };
  

  const handleConfirmBookingClick = () => {
    setPopupState("");
    setDisplayPopup(false);
  
    // Proceed with booking if no overlap
    const bookingData = {
      VENUE_ID: selectedVenue.VENUE_ID,
      USER_ID: userID,
      EVENT_NAME: eventName,
      DATE: bookingDate.toISOString().split('T')[0],
      START_TIME: selectedTimeSlot.start,
      END_TIME: selectedTimeSlot.end,
      DATE_CREATED: new Date().toISOString().split('T')[0],
      BOOKING_STATUS: "Confirmed"
    };
  
    mutation.mutate(bookingData);
  };

  const handleBackToVenueBookingClick = () => {
    setPopupState("");
    setDisplayPopup(false);
  };

  const handleHeaderBackIconClick = () => {
    navigate("/student-home");
  }

  const handleBookingSuccessfulClick = () => {
    setDisplayPopup(false);
    navigate("/student-home");
  };

  const handleOnVenueSelectionClick = () => {
    const venueSelectionDetails = {
      SOURCE_PAGE: "/booking",
      DESTINATION_PAGE: "/booking"
    };
    navigate("/campus-selection", { state: venueSelectionDetails });
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
    <>
      <main className='booking-layout'>
        <article className='booking-heading'>
          <img onClick={handleHeaderBackIconClick} src={headingIcon} alt='back-arrow' className='booking-icons' />
          <h1>Book Event</h1>
        </article>

        <section className='booking-container'>
          <div className="calendar-placeholder">
          <Calendar
            onChange={(date) => {
              // Normalize selected date to midnight
              const normalizedDate = new Date(date);
              normalizedDate.setHours(0, 0, 0, 0);
              setBookingDate(normalizedDate);
            }}
            value={bookingDate}
            onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            tileDisabled={tileDisabled}
            tileContent={tileContent}
            showNeighboringMonth={false}
            prev2Label={null}
            next2Label={null}
          />
          </div>

          <div className="booking-form">
            <input
              type="text"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="input-field"
            />
            <div onClick={handleOnVenueSelectionClick} className="predefined-field">
              {selectedVenue.BUILDING_NAME ? selectedVenue.BUILDING_NAME : "Choose a venue"}
            </div>
            <div className="predefined-field">
              {selectedVenue.VENUE_NAME}
            </div>

            <div className="predefined-field">
              <select value={selectedTimeSlot ? timeSlots.indexOf(selectedTimeSlot) : ''} onChange={handleTimeSlotChange}>
                <option value="">Time Slot</option>
                {timeSlots.map((slot, index) => (
                  <option key={index} value={index}>
                    {`${slot.start} - ${slot.end}`}
                  </option>
                ))}
              </select>
            </div>

            <button className="book-button" onClick={handleSubmit} disabled={loading}>
              {loading ? "Checking availability..." : "Book event"}
            </button>
          </div>
        </section>
      </main>

      {popupState === "Invalid Details" &&
        <Popup trigger={displayPopup}>
          <h2>Invalid Details</h2>
          <p>Please fill in all fields</p>
          <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
        </Popup>
      }

      {popupState === "Confirm Booking" &&
        <Popup trigger={displayPopup}>
          <h2>Confirmation</h2>
          <p>Do you want to place a booking for this event?</p>
          <article className='confirm-booking-button-container'>
            <button onClick={handleConfirmBookingClick} className='booking-popup-button'>Yes</button>
            <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>No</button>
          </article>
        </Popup>
      }

      {popupState === "Booking Successful" &&
        <Popup trigger={displayPopup}>
          <h2>Confirmation</h2>
          <p>Your event has been booked!</p>
          <button onClick={handleBookingSuccessfulClick} className='booking-popup-button'>Close</button>
        </Popup>
      }

      {popupState === "Booking Failed" &&
        <Popup trigger={displayPopup}>
          <h2>Booking Error</h2>
          <p>Failed to book your event!</p>
          <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
        </Popup>
      }

      {popupState === "Time Slot Overlap" &&
        <Popup trigger={displayPopup}>
          <h2>Time Slot Overlap</h2>
          <p>The selected time slot overlaps with an existing booking.</p>
          <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
        </Popup>
      }
    </>
  );
};

export default BookingPage;
