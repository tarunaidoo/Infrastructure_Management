import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './EventDetailsCard';

test('should render Card component with correct event details', () => {
  // Arrange: Pass the props for the Card component
  render(<Card event="Tech Conference" date="2024-09-10" time="10:00 AM" venue="Tech Hub" room="305" />);
  
  // Act: Select the Card component using getByTestId (You need to add a test id)
  const cardElement = screen.getByTestId('Event-Card-1');

  // Assert: Verify that the Card component is in the document
  expect(cardElement).toBeInTheDocument();

  // Additional assertions to check content
  expect(screen.getByText('Tech Conference')).toBeInTheDocument();
  expect(screen.getByText('Date: 2024-09-10')).toBeInTheDocument();
  expect(screen.getByText('Time: 10:00 AM')).toBeInTheDocument();
  expect(screen.getByText('Venue: Tech Hub')).toBeInTheDocument();
  expect(screen.getByText('Room: 305')).toBeInTheDocument();
});
