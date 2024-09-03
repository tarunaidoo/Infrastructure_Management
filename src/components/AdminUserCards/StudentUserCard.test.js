import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for the toBeInTheDocument matcher
import StudentUserCard from './StudentUserCard';

describe('StudentUserCard Component', () => {
  test('renders the StudentUserCard with the correct title', () => {
    render(<StudentUserCard onClick={() => {}} />);
    
    // Check if the card is rendered with the correct title
    const titleElement = screen.getByText('Student Bookings');
    expect(titleElement).toBeInTheDocument();
    
    // Check if the card has the correct data-testid
    const cardElement = screen.getByTestId('StudentCard-1');
    expect(cardElement).toBeInTheDocument();
  });

  test('calls the onClick handler when the card is clicked', () => {
    const handleClick = jest.fn();
    render(<StudentUserCard onClick={handleClick} />);
    
    // Get the card element and click it
    const cardElement = screen.getByTestId('StudentCard-1');
    fireEvent.click(cardElement);
    
    // Verify that the onClick handler was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
