import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/EventDetailsHeader/EventDetailsHeader';
import Card from '../../components/EventDetailsCard/EventDetailsCard';
import xIcon from '../../assets/icons/xmark.svg';
import './EventDetailsPage.css';
import { useDeleteBooking } from '../../services/HomePages/HomePage.service';

function EventDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure safely
  const { booking = {}, venue = {}, building = {} } = location.state || { booking: {}, venue: {}, building: {} };
  const deleteBookingMutation = useDeleteBooking();

  const handleDeleteClick = () => {
    deleteBookingMutation.mutate(booking.BOOKING_ID, {
      onSuccess: () => {
        navigate('/student-home');
      },
      onError: (error) => {
        console.error('Error deleting booking:', error); // Log the error for debugging
      },
    });
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
          <button 
            className='cancel-event-button' 
            onClick={handleDeleteClick} 
            disabled={deleteBookingMutation.isLoading}
            aria-label='Cancel Booking'
          >
            <img src={xIcon} alt='Cancel booking' />
            {deleteBookingMutation.isLoading ? 'Cancelling...' : 'Cancel Booking'}
          </button>
          {deleteBookingMutation.isError && <p className="error-message">Error cancelling booking</p>}
        </section>
      </main>
    </>
  );
}

export default EventDetailsPage;
