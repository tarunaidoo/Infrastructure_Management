// AdminNotification.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminNotification from './AdminNotification';

// Mock Data
const mockIssues = [
  'Broken projector',
  'Leaky roof',
  'Uncomfortable seating',
];

const mockVenues = [
  'Room 101',
  'Hall A',
  'Room 202',
];

describe('AdminNotification Component', () => {
  const mockOnClose = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders notification header', () => {
    render(<AdminNotification arrayOfIssues={[]} arrayOfVenues={[]} onClose={mockOnClose} />);
    const headerElement = screen.getByText(/Today's Issues/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('displays issues when provided', () => {
    render(<AdminNotification arrayOfIssues={mockIssues} arrayOfVenues={mockVenues} onClose={mockOnClose} />);

    mockIssues.forEach((issue, index) => {
      expect(screen.getByText(`${issue} at ${mockVenues[index]}`)).toBeInTheDocument();
    });
  });

  test('displays message when no issues are reported', () => {
    render(<AdminNotification arrayOfIssues={[]} arrayOfVenues={[]} onClose={mockOnClose} />);
    const noIssuesMessage = screen.getByText(/No issues reported today/i);
    expect(noIssuesMessage).toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(<AdminNotification arrayOfIssues={['Issue 1']} arrayOfVenues={['Venue A']} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText(/Close/i);
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('renders notification overlay', () => {
    render(<AdminNotification arrayOfIssues={[]} arrayOfVenues={[]} onClose={mockOnClose} />);
    const overlay = screen.getByTestId('popupIssues-1');
    expect(overlay).toBeInTheDocument();
  });
});
