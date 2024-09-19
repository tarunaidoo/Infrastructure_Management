import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from './HomePageCard'; // Adjust the import path if necessary
import '@testing-library/jest-dom';

test('renders Card component with event details and icon', () => {
  // Mock data
  const mockEvent = 'Sample Event';
  const mockDate = '2024-09-20';
  const mockTime = '10:00 AM';
  const mockVenue = 'Sample Venue';
  const mockRoom = 'Room 101';

  // Render the Card component
  render(
    <Card
      event={mockEvent}
      date={mockDate}
      time={mockTime}
      venue={mockVenue}
      room={mockRoom}
    />
  );

  // Check if the event, date, and venue text content are rendered
  expect(screen.getByText(mockEvent)).toBeInTheDocument();
  expect(screen.getByText(mockDate)).toBeInTheDocument();
  expect(screen.getByText(mockTime)).toBeInTheDocument();
  expect(screen.getByText(mockVenue)).toBeInTheDocument();
  expect(screen.getByText(mockRoom)).toBeInTheDocument();

  // Check if the bookmark icon is rendered
  expect(screen.getByAltText('bookmark-icon')).toBeInTheDocument();
});
