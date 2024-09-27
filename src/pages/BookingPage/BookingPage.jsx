import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';

import Calendar from "react-calendar";
import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import Popup from '../../components/Popup/Popup';
import { createBooking, getBookings } from '../../services/BookingPage/BookingPage.service';
import { formatDateToISO } from '../../utils/dateUtils';
import { checkForTimeClash } from '../../utils/bookingValidationUtil/bookingValidationUtil';
import { generateTimeOptions } from '../../utils/timeUtils';

import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import './BookingPage.css';

import headingIcon from '../../assets/icons/chevron-left.svg';


const BookingPage = () => {
    const userID = localStorage.getItem('userEmail');
    const navigate = useNavigate();
    const location = useLocation();
    const selectedVenue = location.state || {};
    const timeOptions = generateTimeOptions();

    const [activeStartDate, setActiveStartDate] = useState(new Date());
    const [popupState, setPopupState] = useState("");
    const [displayPopup, setDisplayPopup] = useState(false);
    const [bookingPageInfo, setBookingPageInfo] = useState(selectedVenue.BOOKING_PAGE_INFO || {
        EVENT_NAME: "",
        BOOKING_DATE: new Date(),
        START_TIME: "",
        END_TIME: ""
    });

    const mutation = useMutation((newBooking) => createBooking(newBooking), {
        onSuccess: () => {
            setPopupState("Booking Successful");
            setDisplayPopup(true);
        },
        onError: () => {
            setPopupState("Booking Failed");
            setDisplayPopup(true);
        }
    });

    const { data: bookings, error: bookingsError, isLoading: bookingsLoading } = useQuery("bookingsData", getBookings);

    const handleSubmitButtonClick = async () => {
        if (!selectedVenue || !bookingPageInfo.START_TIME || !bookingPageInfo.END_TIME || !bookingPageInfo.EVENT_NAME) {
            setPopupState("Invalid Details");
            setDisplayPopup(true);
            return;
        }

        const overlapExists = checkForTimeClash(
            bookings, 
            selectedVenue.VENUE_ID, 
            formatDateToISO(bookingPageInfo.BOOKING_DATE), 
            bookingPageInfo.START_TIME, 
            bookingPageInfo.END_TIME
        );

        if (overlapExists) {
            setPopupState("Time Slot Overlap");
            setDisplayPopup(true);
        }
        else {
            setPopupState("Confirm Booking");
            setDisplayPopup(true);
        }
    };

    const handleConfirmBookingClick = () => {
        setPopupState("");
        setDisplayPopup(false);

        const bookingData = {
            VENUE_ID: selectedVenue.VENUE_ID,
            USER_ID: userID,
            EVENT_NAME: bookingPageInfo.EVENT_NAME,
            DATE: formatDateToISO(bookingPageInfo.BOOKING_DATE),
            START_TIME: bookingPageInfo.START_TIME,
            END_TIME: bookingPageInfo.END_TIME,
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
            DESTINATION_PAGE: "/booking",
            BOOKING_PAGE_INFO: bookingPageInfo,
        };
        navigate("/campus-selection", { state: venueSelectionDetails});
    };

    const handleStartTimeChange = (event) => {
        const selectedTime = `${event.target.value}:00`; // Append seconds
    
        const currentDate = new Date();
        const selectedDate = formatDateToISO(bookingPageInfo.BOOKING_DATE);

        if (bookingPageInfo.END_TIME) {
            if (new Date(`1970-01-01T${selectedTime}`) >= new Date(`1970-01-01T${bookingPageInfo.END_TIME}`)) {
                
                setBookingPageInfo({
                    EVENT_NAME: bookingPageInfo.EVENT_NAME,
                    BOOKING_DATE: bookingPageInfo.BOOKING_DATE,
                    START_TIME: "",
                    END_TIME: ""
                });

                setPopupState("Start time must be before end time");
                setDisplayPopup(true);
                return;
            }
        }

        // If booking is for today, restrict start time to be one hour before the current hour
        if ( selectedDate === formatDateToISO(currentDate) && parseInt(selectedTime.slice(0, 2)) < currentDate.getHours()) {
            setBookingPageInfo({
                EVENT_NAME: bookingPageInfo.EVENT_NAME,
                BOOKING_DATE: bookingPageInfo.BOOKING_DATE,
                START_TIME: "",
                END_TIME: ""
            });

            setPopupState("Invalid Start TIme");
            setDisplayPopup(true);
        } else {
            setBookingPageInfo({
                EVENT_NAME: bookingPageInfo.EVENT_NAME,
                BOOKING_DATE: bookingPageInfo.BOOKING_DATE,
                START_TIME: selectedTime,
                END_TIME: bookingPageInfo.END_TIME
            });
        }
    };
  
    const handleEndTimeChange = (event) => {
        const newEndTime = `${event.target.value}:00`; // Append seconds

        // Ensure the start time is set before allowing end time input
        if (!bookingPageInfo.START_TIME) {
            setPopupState("Please select a start time first");
            setDisplayPopup(true);
            return; // Prevent further execution until a start time is set
        }

        // Check if the new end time is before the start time
        if (new Date(`1970-01-01T${newEndTime}`) <= new Date(`1970-01-01T${bookingPageInfo.START_TIME}`)) {
            setPopupState("End time must be after start time");
            setDisplayPopup(true);
        } else {
            setBookingPageInfo({
                EVENT_NAME: bookingPageInfo.EVENT_NAME,
                BOOKING_DATE: bookingPageInfo.BOOKING_DATE,
                START_TIME: bookingPageInfo.START_TIME,
                END_TIME: newEndTime
            });

            setPopupState(""); // Clear any previous popup state
            setDisplayPopup(false); // Hide popup if time is valid
        }
    };


    const tileDisabled = ({ date, view }) => {
      if (view === 'month' || view === 'year' || view === 'decade') {
          // Disable past dates
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for comparison

          return date < today; // Disable dates before today
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

    if (bookingsLoading) {
        return (
            <main className='booking-layout'>
                <article onClick={handleHeaderBackIconClick} className='booking-heading'>
                    <img src={headingIcon} alt='back-arrow' className='booking-icons' />
                    <h1>Book Event</h1>
                </article>

                <section className='booking-container'>
                    <main className='booking-loading-component-container'>
                        <LoadingComponent colour="#D4A843" size="15px" isLoading={bookingsLoading}/>
                    </main>
                </section>
            </main>
        );
    }

    if (bookingsError) {
        return (
            <main className='booking-layout'>
                <article onClick={handleHeaderBackIconClick} className='booking-heading'>
                    <img src={headingIcon} alt='back-arrow' className='booking-icons' />
                    <h1>Book Event</h1>
                </article>

                <section className='booking-container'>
                    <main className="room-selection-centered-container">
                       <p> bookingsError </p>
                    </main>
                </section>
            </main>
        );
    }

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
                            setBookingPageInfo({
                                EVENT_NAME: bookingPageInfo.EVENT_NAME,
                                BOOKING_DATE: normalizedDate,
                                START_TIME: "",
                                END_TIME: ""
                            });
                        }}
                        value={bookingPageInfo.BOOKING_DATE}
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
                        value={bookingPageInfo.EVENT_NAME}
                        onChange={(e) => (
                            setBookingPageInfo({
                            EVENT_NAME: e.target.value,
                            BOOKING_DATE: bookingPageInfo.BOOKING_DATE,
                            START_TIME: bookingPageInfo.START_TIME,
                            END_TIME: bookingPageInfo.END_TIME
                            })
                        )}
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
                                    value={bookingPageInfo.START_TIME.slice(0, 5)} // Displaying only HH:mm
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
                                    value={bookingPageInfo.END_TIME.slice(0, 5)} // Displaying only HH:mm
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

                    <button className="book-button" onClick={handleSubmitButtonClick}>
                        Book event
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

        {popupState === "Start time must be before end time" &&
            <Popup trigger={displayPopup}>
                <h2>Invalid Time</h2>
                <p>Start time must be before end time. Please select a valid time.</p>
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

        {popupState === "Please select a start time first" &&
            <Popup trigger={displayPopup}>
                <h2>Select a start time </h2>
                <p> Please select a start time for your booking first.</p>
                <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
            </Popup>
        }

        {popupState === "Invalid Start TIme" &&
            <Popup trigger={displayPopup}>
                <h2>Invalid Start Time</h2>
                <p>Please select a start time later than the current hour for today!</p>
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
