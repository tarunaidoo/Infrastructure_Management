// Popup.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Popup from './PopUpEventsBooked';

describe('Popup Component', () => {
  const mockProps = {
    title: 'Event Booked',
    studentName: 'John Doe',
    date: 'Mon Sep 09 2024',
    time: '14:00',
    venue: 'Room 101',
    onClose: jest.fn(),
  };

  test('renders the popup with correct content', () => {
    render(<Popup {...mockProps} />);
    
   // Check for the title
  expect(screen.getByText(mockProps.title)).toBeInTheDocument();
  
  // Check for student name, date, time, and venue separately
  expect(screen.getByText('Student:')).toBeInTheDocument();
  expect(screen.getByText(mockProps.studentName)).toBeInTheDocument();
  
  expect(screen.getByText('Date:')).toBeInTheDocument();
  expect(screen.getByText(mockProps.date)).toBeInTheDocument();
  
  expect(screen.getByText('Time:')).toBeInTheDocument();
  expect(screen.getByText(mockProps.time)).toBeInTheDocument();
  
  expect(screen.getByText('Venue:')).toBeInTheDocument();
  expect(screen.getByText(mockProps.venue)).toBeInTheDocument();
  });

  test('closes the popup when close button is clicked', () => {
    render(<Popup {...mockProps} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    // Ensure the onClose function is called when close button is clicked
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('has the correct test id', () => {
    render(<Popup {...mockProps} />);
    
    // Check for the correct test id
    const popupElement = screen.getByTestId('popupEvents-1');
    expect(popupElement).toBeInTheDocument();
  });
});
