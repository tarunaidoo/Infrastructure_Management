import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/EventDetailsHeader/EventDetailsHeader';
import Card from '../../components/EventDetailsCard/EventDetailsCard';
import xIcon from '../../assets/icons/xmark.svg'
import './EventDetailsPage.css';
import { deleteBooking } from '../../services/HomePages/HomePage.service';
import { useNavigate } from 'react-router-dom';

function EventDetailsPage() {
  const location = useLocation();
  
  // Ensure location.state is defined and fallback to empty object if not
  const { booking = {}, venue = {}, building = {} } = location.state || {};
  console.log(booking);

  const navigate = useNavigate();
  const handleDeleteClick = () => {
    deleteBooking(booking.BOOKING_ID);
    navigate('/student-home');
  };

  return (
    <>
      <main className='event-body'>
        <Header />
        <section className='event-content'>
          <Card 
            event={booking.EVENT_NAME || 'Unknown Event'} 
            date={booking.DATE || 'Unknown Date'} 
            time={`${booking.START_TIME || 'Unknown'} - ${booking.END_TIME || 'Unknown'}`} 
            venue={building?.BUILDING_NAME || 'Unknown Building'} 
            room={venue?.VENUE_NAME || 'Unknown Room'} 
          />
          <button className='cancel-event-button' onClick={handleDeleteClick}>
          <img src={xIcon} alt='xIcon' />
            Cancel Booking</button>
        </section>
      </main>
    </>
  );
}

export default EventDetailsPage;
