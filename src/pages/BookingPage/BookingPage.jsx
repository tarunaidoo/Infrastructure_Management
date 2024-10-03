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
import { addWeeksToDate } from '../../utils/RecurringUtils';
import ResetIcon from '../../assets/icons/resetIcon.svg';
import RecurringIcon from '../../assets/icons/recurringIcon.svg';


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
    
  

    // Additional state for recurring booking popup
    const [showRecurringPopup, setShowRecurringPopup] = useState(false);
    const [recurringDetails, setRecurringDetails] = useState({ weeks: '' });
    const [numberOfBookings, setNumberOfBookings] = useState(1);
   


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

        let overlapExists = false;
        if (numberOfBookings > 1) {
            for (let i = 0; i < numberOfBookings; i++){
                let isOverlapping = checkForTimeClash(
                    bookings, 
                    selectedVenue.VENUE_ID, 
                    formatDateToISO(addWeeksToDate(bookingPageInfo.BOOKING_DATE, i)), 
                    bookingPageInfo.START_TIME, 
                    bookingPageInfo.END_TIME
                );

                if (isOverlapping){
                    overlapExists = true;
                    break;
                }
            }
        }

        else {
            overlapExists = checkForTimeClash(
                bookings, 
                selectedVenue.VENUE_ID, 
                formatDateToISO(bookingPageInfo.BOOKING_DATE), 
                bookingPageInfo.START_TIME, 
                bookingPageInfo.END_TIME
            );
        }

        if (overlapExists) {
            setPopupState("Booking Overlap");
            setDisplayPopup(true);
        } else {
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

        if (numberOfBookings > 0) {
            for (let i = 0; i < numberOfBookings; i++) {
                const newBookingData = {
                    ...bookingData,
                    // Adjusting the date for each booking using the addWeeksToDate function
                    DATE: formatDateToISO(addWeeksToDate(bookingData.DATE, i)), // Using i to increment weeks
                };
    
                mutation.mutate(newBookingData); // Mutate for each booking
            }
        } else {
            // Handle single booking logic
            mutation.mutate(bookingData);
        }
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
        navigate("/campus-selection", { state: venueSelectionDetails });
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
        if (selectedDate === formatDateToISO(currentDate) && parseInt(selectedTime.slice(0, 2)) < currentDate.getHours()) {
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
    const [recurringBookingSummary, setRecurringBookingSummary] = useState('');


    // Handler to open the recurring popup
    const handleOpenRecurringPopup = () => {
        setShowRecurringPopup(true);
    };

    // Handler to close the recurring popup without confirming
    const handleCloseRecurringPopup = () => {
        setRecurringDetails({ weeks: '' });
        // setRecurringBookingSummary('');
        setShowRecurringPopup(false);
    };

    // Handler to confirm and proceed with the recurring booking
    const handleConfirmRecurringBooking = () => {
        // Extract the day of the week from the booking date
        const bookingDate = new Date(bookingPageInfo.BOOKING_DATE);
        const dayOfWeek = bookingDate.toLocaleString('en-US', { weekday: 'long' });
        // Create the sentence for the recurring booking summary with the day of the week
        let bookingSummary = `Every ${dayOfWeek} for the next ${recurringDetails.weeks} ${recurringDetails.weeks === "1" ? 'Week' : 'Weeks'}`;
        if(recurringDetails.weeks <= 1 ){
             bookingSummary = 'No recurring bookings';
        }

        // Update the input field with the recurring booking summary
        setRecurringBookingSummary(bookingSummary);
    
        setNumberOfBookings(Number(recurringDetails.weeks)); // Store the number of bookings
        setShowRecurringPopup(false); // Close the popup
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
                        <LoadingComponent colour="#D4A843" size="15px" isLoading={bookingsLoading} />
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
                    <section className="fields">
                        <div className="fields-left">
                            <section className="input-wrapper">
                                <div>
                                    <input
                                        type="text"
                                        value={bookingPageInfo.EVENT_NAME}
                                        id='input-event-name'
                                        required  
                                        onChange={(e) => (
                                            setBookingPageInfo({
                                                EVENT_NAME: e.target.value,
                                                BOOKING_DATE: bookingPageInfo.BOOKING_DATE,
                                                START_TIME: bookingPageInfo.START_TIME,
                                                END_TIME: bookingPageInfo.END_TIME
                                            })
                                        )}
                                    />
                                    <label 
                                        for='input-event-name' 
                                        class='placeholder'>
                                        Event Name
                                    </label>
                                </div>
                            </section>

                            <section className="input-wrapper" onClick={handleOnVenueSelectionClick}>
                                <div >
                                    <input 
                                        type="text" 
                                        id="input-building-name" 
                                        value={selectedVenue.BUILDING_NAME || ""} 
                                        readOnly 
                                        required 
                                    />
                                    <label 
                                        for="input-building-name" 
                                        class="placeholder">
                                        Select a venue
                                    </label>
                                </div>
                            </section>

                            <section className="input-wrapper">
                                <div className="input-container">
                                    <input 
                                        type="text" 
                                        id="input-venue-name" 
                                        value={selectedVenue.VENUE_NAME || ""} 
                                        readOnly 
                                        required 
                                    />
                                    <label 
                                        for="input-venue-name" 
                                        class="placeholder">
                                            Room
                                    </label>
                                </div>
                            </section>
                        </div>

                        <div className="fields-right">
                            
                            <section className="input-wrapper">
                                <div >
                                    <label 
                                        for="input" 
                                        class="placeholder">
                                            From
                                    </label>
                                    <select
                                        id="select"
                                        value={bookingPageInfo.START_TIME.slice(0, 5)} // Displaying only HH:mm
                                        onChange={handleStartTimeChange}
                                        
                                        required
                                    >
                                        <option value="" disabled>- - : - -</option>
                                        {timeOptions.map((time, index) => (
                                            <option key={index} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </section>

                            <section className="input-wrapper">
                                <div >
                                    <label 
                                        for="input" 
                                        class="placeholder">
                                            To
                                    </label>
                                    <select
                                        id="input"
                                        value={bookingPageInfo.END_TIME.slice(0, 5)} // Displaying only HH:mm
                                        onChange={handleEndTimeChange}
                                        required
                                    >
                                        <option value="" disabled>- - : - -</option>
                                        {timeOptions.map((time, index) => (
                                            <option key={index} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                                
                            </section>
                            
                        </div>                        
                    </section>

                    <section className='recurring-booking-container'>
                    <section className="input-wrapper">
                        <div className="input-container">
                                <input 
                                    type="text" 
                                    id="recurring" 
                                    placeholder="No recuring bookings."
                                    value={recurringBookingSummary}
                                    readOnly 
                                    required 
                                />
                                <label 
                                    htmlFor="recurring" 
                                    className="placeholder">
                                    Recurring Booking
                                </label>
                            </div>
                        </section>

                        <div className='recurring-booking-button-wrapper'>
                            <button 
                                className='recurring-booking-button' 
                                onClick={() => {
                                    // Reset recurring details
                                    handleOpenRecurringPopup();
                                }}
                                >
                                <img src={RecurringIcon} alt="Recurring Icon" style={{ marginRight:'5%',width: '24px', height: '24px' }} />
                            </button>
                        </div>
                    </section>                                

                    <button className="book-button" onClick={handleSubmitButtonClick}>
                        Book event
                    </button>
                    
                </section>
            </section>
        </main>
            {/* Recurring Booking Popup */}
            {showRecurringPopup && (
            <Popup trigger={showRecurringPopup}>
                <h3> Set Recurring Booking</h3>
                <section className='recurring-booking-form'>
                    <label>
                        Repeat over:
                        <input
                            type="number"
                            min="2"
                            value={recurringDetails.weeks}
                            onChange={(e) => setRecurringDetails({ ...recurringDetails, weeks: e.target.value })}
                            placeholder=""
                        /> 
                        Weeks
                        
                    </label>
                    <section className='reset-button-container'>
                        <img
                            onClick={() => {
                                // Reset recurring details
                                setRecurringDetails({ weeks: '' }); // Reset to default value
                                setRecurringBookingSummary(''); // Reset summary to empty
                                
                            }}
                            className="reset-icon" 
                            src={ResetIcon} 
                            alt="Reset Icon"
                        />
                    </section>
                    <article className='recurring-booking-button-container'>
                        <button 
                            onClick={() => {
                                // Save the number of bookings and close the popup
                                handleConfirmRecurringBooking(); // Optionally you can also handle saving the weeks here if needed
                                setShowRecurringPopup(false); // Close the popup
                            }} 
                            className='booking-popup-button'>
                            Confirm
                        </button>   
                        <button onClick={handleCloseRecurringPopup} className='booking-popup-button'>Cancel</button>
                    </article>
                </section>
            </Popup>
        )}




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

        {popupState === "Booking Overlap" &&
            <Popup trigger={displayPopup}>
                <h2>Booking Overlap</h2>
                <p>The selected time slot overlaps with an existing booking.</p>
                <button onClick={handleBackToVenueBookingClick} className='booking-popup-button'>Close</button>
            </Popup>
        }
    </>
    );
};

export default BookingPage;
