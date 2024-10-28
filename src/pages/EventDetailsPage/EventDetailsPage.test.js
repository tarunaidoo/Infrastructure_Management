import React from 'react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventDetailsPage from './EventDetailsPage'; // Adjust the import path as necessary
import { useDeleteBooking } from '../../services/HomePages/HomePage.service';

// Mock the useDeleteBooking hook
jest.mock('../../services/HomePages/HomePage.service', () => ({
  useDeleteBooking: jest.fn(),
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
    // Mock the deleteBooking mutation
    const deleteBookingMock = jest.fn();
    useDeleteBooking.mockReturnValue({ mutate: deleteBookingMock, isLoading: false });

    // Render the EventDetailsPage component inside MemoryRouter
    render(
      <MemoryRouter initialEntries={[{ pathname: '/event-details', state: { booking, venue, building } }]}>
        <EventDetailsPage />
      </MemoryRouter>
    );

    // Check that the event details are displayed
    expect(screen.getByText('Sample Event')).toBeInTheDocument();
    expect(screen.getByText(/2024-10-01/i)).toBeInTheDocument();
    expect(screen.getByText(/10:00 AM - 11:00 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/Building 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Room A/i)).toBeInTheDocument();

    // Click the Cancel Booking button
    const cancelButton = screen.getByRole('button', { name: /Cancel Booking/i });
    await userEvent.click(cancelButton);

    // Verify that deleteBooking was called with the correct booking ID
    expect(deleteBookingMock).toHaveBeenCalledWith(booking.BOOKING_ID, expect.objectContaining({
      onError: expect.any(Function), // Expecting a function
      onSuccess: expect.any(Function), // Expecting a function
    }));
  });

  test('displays loading state when deleting', async () => {
    const deleteBookingMock = jest.fn().mockImplementation(() => new Promise(() => {}));
    useDeleteBooking.mockReturnValue({ mutate: deleteBookingMock, isLoading: true });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/event-details', state: { booking, venue, building } }]}>
        <EventDetailsPage />
      </MemoryRouter>
    );

    // Check that the Cancel Booking button shows 'Cancelling...'
    const cancelButton = screen.getByRole('button', { name: /Cancel Booking/i });
    expect(cancelButton).toHaveTextContent('Cancelling...');
  });
});
