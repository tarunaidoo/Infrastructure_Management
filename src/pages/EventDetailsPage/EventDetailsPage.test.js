// EventDetailsPage.test.js
import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventDetailsPage from './EventDetailsPage'; // Adjust the import path as necessary
import { deleteBooking } from '../../services/HomePages/HomePage.service';

// Mock the deleteBooking function
jest.mock('../../services/HomePages/HomePage.service', () => ({
  deleteBooking: jest.fn(),
}));

describe('EventDetailsPage', () => {
  const booking = {
    BOOKING_ID: 123,
    EVENT_NAME: 'Sample Event',
    DATE: '2024-10-01',
    START_TIME: '10:00 AM',
    END_TIME: '11:00 AM',
  };

  const venue = {
    VENUE_NAME: 'Room A',
  };

  const building = {
    BUILDING_NAME: 'Building 1',
  };

  test('displays booking details and handles cancel button click', async () => {
    // Render the EventDetailsPage component inside MemoryRouter
    render(
      <MemoryRouter initialEntries={[{ pathname: '/event-details', state: { booking, venue, building } }]}>
        <EventDetailsPage />
      </MemoryRouter>
    );

    // Check that the event details are displayed
    expect(screen.getByText('Sample Event')).toBeInTheDocument();
    expect(screen.getByText(/Date:\s*2024-10-01/i)).toBeInTheDocument(); // Use regex here
    expect(screen.getByText(/Time:\s*10:00 AM - 11:00 AM/i)).toBeInTheDocument(); // Use regex here
    expect(screen.getByText(/Venue:\s*Building 1/i)).toBeInTheDocument(); // Use regex here
    expect(screen.getByText(/Room:\s*Room A/i)).toBeInTheDocument(); // Use regex here

    // Click the Cancel Booking button
    const cancelButton = screen.getByRole('button', { name: /Cancel Booking/i });
    await userEvent.click(cancelButton);

    // Verify that deleteBooking was called with the correct booking ID
    expect(deleteBooking).toHaveBeenCalledWith(booking.BOOKING_ID);
  });
});