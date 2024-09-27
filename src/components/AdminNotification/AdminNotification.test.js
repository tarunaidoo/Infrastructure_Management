import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better assertion support
import AdminNotification from './AdminNotification';

describe('AdminNotification Component', () => {
  const mockClose = jest.fn();
  const mockNames = ['Issue 1', 'Issue 2', 'Issue 3'];
  const mockVenues = ['Venue A', 'Venue B', 'Venue C'];

  test('renders the component with provided names and venues', () => {
    render(
      <AdminNotification 
        arrayOfNames={mockNames} 
        arrayOfCorrespondingvenues={mockVenues} 
        onClose={mockClose}
      />
    );

    expect(screen.getByText("Today's Issues")).toBeInTheDocument();

    mockNames.forEach((name, index) => {
      const venue = mockVenues[index];
      const listItem = screen.getByText(`${name} - ${venue}`);
      expect(listItem).toBeInTheDocument();
    });
  });

  test('renders the close button', () => {
    render(
      <AdminNotification 
        arrayOfNames={mockNames} 
        arrayOfCorrespondingvenues={mockVenues} 
        onClose={mockClose}
      />
    );

    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <AdminNotification 
        arrayOfNames={mockNames} 
        arrayOfCorrespondingvenues={mockVenues} 
        onClose={mockClose}
      />
    );

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
