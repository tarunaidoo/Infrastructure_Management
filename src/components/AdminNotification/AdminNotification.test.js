import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better assertion support
import AdminNotification from './AdminNotification';

describe('AdminNotification Component', () => {
  const mockClose = jest.fn();
  
  const mockIssue = { TITLE: 'Issue 1' };
  const mockVenue = { VENUE_NAME: 'Venue A' };

  test('renders the component with provided issue and venue', () => {
    render(
      <AdminNotification 
        issue={mockIssue} 
        venue={mockVenue} 
        onClose={mockClose}
      />
    );

    // Check that the title and venue are correctly rendered
    expect(screen.getByText("Today's Issues")).toBeInTheDocument();
    expect(screen.getByText(`Title: ${mockIssue.TITLE}`)).toBeInTheDocument();

    // Use a custom matcher function to match the venue text across elements
    expect(screen.getByText((content, element) => 
      content.includes(mockVenue.VENUE_NAME) && element.tagName.toLowerCase() === 'p'
    )).toBeInTheDocument();
  });

  test('renders the close button', () => {
    render(
      <AdminNotification 
        issue={mockIssue} 
        venue={mockVenue} 
        onClose={mockClose}
      />
    );

    // Querying close button by its role for better accuracy
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <AdminNotification 
        issue={mockIssue} 
        venue={mockVenue} 
        onClose={mockClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledTimes(1);
  });
});
