import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LecturerUserCard from './LecturerUserCard';
import '@testing-library/jest-dom';

describe('LecturerUserCard Component', () => {
  test('renders the LecturerUserCard component with the correct title', () => {
    render(<LecturerUserCard />);
    
    // Query elements using the provided data-testid
    const cardTitle = screen.getByText('Lecturer Bookings');
    const cardTestId = screen.getByTestId('LecturerCard-1');

    // Use variables in expect statements
    expect(cardTitle).toBeInTheDocument();
    expect(cardTestId).toBeInTheDocument();
  });

  test('calls the onClick handler when the card is clicked', () => {
    const onClickMock = jest.fn();
    render(<LecturerUserCard onClick={onClickMock} />);
    
    // Query the card element using the provided data-testid
    const cardTestId = screen.getByTestId('LecturerCard-1');

    // Simulate a click event on the card
    fireEvent.click(cardTestId);
    
    // Check if the onClick handler was called
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
