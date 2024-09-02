import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopupEventsBooked from './PopupEventsBooked'; // Adjust import path as needed

// Example props for the PopupEventsBooked component
const props = {
  title: "Event Details",
  studentName: "John Doe",
  date: "2024-09-15",
  time: "14:00",
  venue: "Main Auditorium",
  room: "101",
  onClose: () => {} // Mock function for the close handler
};

test('should render popup component with details provided', () => {
  render(<PopupEventsBooked {...props} />);
  const popupElement = screen.getByTestId("popupEvents-1"); // Ensure this matches your component's test ID
  expect(popupElement).toBeInTheDocument();
});

test('should render the correct title', () => {
  render(<PopupEventsBooked {...props} />);
  const titleElement = screen.getByText(/Event Details/i);
  expect(titleElement).toBeInTheDocument();
});

//for the following tests, I'm using expected values not testing labels

test('should render the correct student name', () => {
  render(<PopupEventsBooked {...props} />);
  const studentNameElement = screen.getByText(/John Doe/i);
  expect(studentNameElement).toBeInTheDocument();
});

test('should render the correct date', () => {
  render(<PopupEventsBooked {...props} />);
  const dateElement = screen.getByText(/2024-09-15/i);
  expect(dateElement).toBeInTheDocument();
});

test('should render the correct time', () => {
  render(<PopupEventsBooked {...props} />);
  const timeElement = screen.getByText(/14:00/i);
  expect(timeElement).toBeInTheDocument();
});

test('should render the correct venue', () => {
  render(<PopupEventsBooked {...props} />);
  const venueElement = screen.getByText(/Main Auditorium/i);
  expect(venueElement).toBeInTheDocument();
});

test('should render the correct room number', () => {
  render(<PopupEventsBooked {...props} />);
  const roomElement = screen.getByText(/101/i);
  expect(roomElement).toBeInTheDocument();
});

test('should render the close button', () => {
  render(<PopupEventsBooked {...props} />);
  const closeButton = screen.getByRole('button', { name: /close/i });
  expect(closeButton).toBeInTheDocument();
});

test('should call onClose when close button is clicked', () => {
  const handleClose = jest.fn();
  render(<PopupEventsBooked {...props} onClose={handleClose} />);
  const closeButton = screen.getByRole('button', { name: /close/i });
  fireEvent.click(closeButton);
  expect(handleClose).toHaveBeenCalledTimes(1);
});
