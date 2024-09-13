import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for the toBeInTheDocument matcher
import BookedEventsCard from './BookedEventsCards';

describe('BookedEventsCard Component', () => {
  const mockEventDetails = {
    title: 'Event Title',
    studentName: 'John Doe',
    date: '2024-09-01',
    time: '10:00 AM',
    venue: 'Conference Room',
    room: '101'
  };

  test('renders the BookedEventsCard with the correct event name', () => {
    render(<BookedEventsCard eventName="Sample Event" eventDetails={mockEventDetails} />);
    const eventNameElement = screen.getByTestId('event-name');
    expect(eventNameElement).toHaveTextContent('Sample Event');
  });

  test('renders event details correctly', () => {
    render(<BookedEventsCard eventName="Sample Event" eventDetails={mockEventDetails} />);
    expect(screen.getByText(/Date: 2024-09-01/i)).toBeInTheDocument();
    expect(screen.getByText(/Time: 10:00 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/Venue: Conference Room/i)).toBeInTheDocument();
  });

  test('opens the popup when the card is clicked', () => {
    render(<BookedEventsCard eventName="Sample Event" eventDetails={mockEventDetails} />);
    const card = screen.getByTestId('booked-events-card');
    fireEvent.click(card);
    const popup = screen.getByTestId('popupEvents-1');
    expect(popup).toBeInTheDocument();
  });

  test('displays correct event details in the popup', () => {
    render(<BookedEventsCard eventName="Sample Event" eventDetails={mockEventDetails} />);
    const card = screen.getByTestId('booked-events-card'); // Update with correct test ID
    fireEvent.click(card);
    expect(screen.getByText(/Event Title/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });
  

  test('closes the popup when the Close button is clicked', () => {
    render(<BookedEventsCard eventName="Sample Event" eventDetails={mockEventDetails} />);
    const card = screen.getByTestId('booked-events-card');
    fireEvent.click(card);
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    const popup = screen.queryByTestId('popupEvents-1');
    expect(popup).not.toBeInTheDocument();
  });
});
