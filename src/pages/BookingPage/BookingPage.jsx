import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import headingIcon from '../../assets/icons/chevron-left.svg';
import Calendar from "react-calendar";
import { createBooking } from '../../services/BookingPage/BookingPage.service';
import { formatDateToISO } from '../../utils/dateUtils';
import { generateTimeOptions } from '../../utils/timeUtils';
import Popup from '../../components/Popup/Popup';
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import './BookingPage.css';

const BookingPage = () => {
  const userID = localStorage.getItem('userEmail');
  const navigate = useNavigate();
  const location = useLocation();
  const selectedVenue = location.state || {};

  const [eventName, setEventName] = useState('');
  const [bookingDate, setBookingDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [popupState, setPopupState] = useState("");
  const [displayPopup, setDisplayPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const timeOptions = generateTimeOptions();

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
    if (!selectedVenue || !startTime || !endTime || !eventName) {
      setPopupState("Invalid Details");
      setDisplayPopup(true);
      return;
    }

    const normalizedDate = new Date(bookingDate);
    normalizedDate.setHours(0, 0, 0, 0);

    setLoading(true);
    console.log("Start Time: ", startTime);
    console.log("End Time: ", endTime);

    try {
      const overlapExists = await checkForOverlap(
        selectedVenue.VENUE_ID,
        formatDateToISO(normalizedDate),
        startTime,
        endTime
      );
      console.log(overlapExists);
      if (overlapExists) {
        setPopupState("Time Slot Overlap");
        setDisplayPopup(true);
        return;
      }
      else {
        setPopupState("Confirm Booking");
        setDisplayPopup(true);
      }
    } 
    catch (error) {
      console.error("Error during booking process:", error);
      setPopupState("Error");
      setDisplayPopup(true);
    } 
    finally {
      setLoading(false); // Hide loading state after checking for overlap
    }
  };

  const handleConfirmBookingClick = () => {
    setPopupState("");
    setDisplayPopup(false);

    const bookingData = {
      VENUE_ID: selectedVenue.VENUE_ID,
      USER_ID: userID,
      EVENT_NAME: eventName,
      DATE: formatDateToISO(bookingDate), 
      START_TIME: startTime,
      END_TIME: endTime,
      DATE_CREATED: formatDateToISO(new Date()),
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
      USER_ID: userID,
      DESTINATION_PAGE: "/booking"
    };
    navigate("/campus-selection", { state: venueSelectionDetails });
  };

  const handleStartTimeChange = (event) => {
    setStartTime(`${event.target.value}:00`); // Append seconds
  };

  const handleEndTimeChange = (event) => {
    const newEndTime = `${event.target.value}:00`; // Append seconds

    // Check if the new end time is before the start time
    if (startTime && new Date(`1970-01-01T${newEndTime}`) <= new Date(`1970-01-01T${startTime}`)) {
      setPopupState("End time must be after start time");
      setDisplayPopup(true);
    } else {
      setEndTime(newEndTime);
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
            return date.getMonth() !== displayedMonth ? <p></p> : null;
        }
        return null;
    };

    return (
        <>
            <main className='booking-layout'>
                <article onClick={handleHeaderBackIconClick} className='booking-heading'>
                    <img src={headingIcon} alt='back-arrow' className='booking-icons' />
                    <h1>Book Event</h1>
                </article>

                <section className='booking-container'>
                    <article className="calendar-placeholder">
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
                    </article>

                    <section className="booking-form">
                        <input
                            type="text"
                            placeholder="Enter event name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            className="input-field"
                        />
                        <article onClick={handleOnVenueSelectionClick} className="input-field">
                            {selectedVenue.BUILDING_NAME ? selectedVenue.BUILDING_NAME : "Select a venue"}
                        </article>
                        <article className="input-field">
                            {selectedVenue.VENUE_NAME}
                        </article>

            <section className="time-slot">
              <section className="input-field">
                <div>
                  <label>Start Time</label>
                  <select
                    value={startTime.slice(0, 5)} // Displaying only HH:mm
                    onChange={handleStartTimeChange}
                    className="time-dropdown"
                  >
                    <option value="" disabled>- - : - -</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </section>

              <section className="input-field">
                <div>
                  <label>End Time</label>
                  <select
                    value={endTime.slice(0, 5)} // Displaying only HH:mm
                    onChange={handleEndTimeChange}
                    className="time-dropdown"
                  >
                    <option value="" disabled>- - : - -</option>
                    {timeOptions.map((time, index) => (
                      <option key={index} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </section>
            </section>

                        <button className="book-button" onClick={handleSubmit} disabled={loading}>
                            {loading ? "Checking availability..." : "Book event"}
                        </button>
                    </section>
                </section>
            </main>

      {popupState === "Invalid Details" &&
        <Popup trigger={displayPopup}>
          <h2>Invalid Details</h2>
          <p>Please fill in all fields</p>
          <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
        </Popup>
      }

      {popupState === "End time must be after start time" &&
        <Popup trigger={displayPopup}>
          <h2>Invalid Time</h2>
          <p>The end time must be after the start time. Please select a valid time.</p>
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
      {popupState === "Booking Successful" &&
        <Popup trigger={displayPopup}>
          <h2>Confirmation</h2>
          <p>Your event has been booked!</p>
          <button onClick={handleHeaderBackIconClick} className='booking-popup-button'>Close</button>
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
