import React from "react";
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import PopUpIssuesReported from './PopUpIssuesReported';

const props = {
    title: 'Tester Issue',
    user: 'John Doe',
    date: '2024-09-01',
    time: '14:00',
    venue: 'Main Hall',
    room: '101',
    description: 'This is a test issue description.',
    onClose: () => {}, //mock function for close handler
};

test('should render popup component with details provided', () => {
    render(<PopUpIssuesReported {...props} />);
    const popupElement = screen.getByTestId("popIssues-1"); // Ensure this matches your component's test ID
    expect(popupElement).toBeInTheDocument();
  });
  
  test('should render the correct title', () => {
    render(<PopUpIssuesReported {...props} />);
    const titleElement = screen.getByText(/Test Issue/i);
    expect(titleElement).toBeInTheDocument();
  });
  
  test('should render the correct user', () => {
    render(<PopUpIssuesReported {...props} />);
    const userElement = screen.getByText(/John Doe/i);
    expect(userElement).toBeInTheDocument();
  });
  
  test('should render the correct date', () => {
    render(<PopUpIssuesReported {...props} />);
    const dateElement = screen.getByText(/2024-09-01/i);
    expect(dateElement).toBeInTheDocument();
  });
  
  test('should render the correct time', () => {
    render(<PopUpIssuesReported {...props} />);
    const timeElement = screen.getByText(/14:00/i);
    expect(timeElement).toBeInTheDocument();
  });
  
  test('should render the correct venue', () => {
    render(<PopUpIssuesReported {...props} />);
    const venueElement = screen.getByText(/Main Hall/i);
    expect(venueElement).toBeInTheDocument();
  });
  
  test('should render the correct room number', () => {
    render(<PopUpIssuesReported {...props} />);
    const roomElement = screen.getByText(/101/i);
    expect(roomElement).toBeInTheDocument();
  });
  
  test('should render the correct description', () => {
    render(<PopUpIssuesReported {...props} />);
    const descriptionElement = screen.getByText(/This is a test issue description./i);
    expect(descriptionElement).toBeInTheDocument();
  });
  
  test('should render the close button', () => {
    render(<PopUpIssuesReported {...props} />);
    const closeButton = screen.getByRole('button', { name: /Close/i });
    expect(closeButton).toBeInTheDocument();
  });
  
  test('should call onClose when close button is clicked', () => {
    const handleClose = jest.fn();
    render(<PopUpIssuesReported {...props} onClose={handleClose} />);
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  //test dependent on user inputs - uses dynamic props
/*import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PopUpIssuesReported from './PopUpIssuesReported'; // Adjust import path as needed

// Function to create a set of props with dynamic values
const createProps = (overrides = {}) => ({
  title: 'Tester Issue',
  user: 'John Doe',
  date: '2024-09-01',
  time: '14:00',
  venue: 'Main Hall',
  room: '101',
  description: 'This is a test issue description.',
  onClose: () => {}, // mock function for close handler
  ...overrides,
});

test('should render popup component with details provided', () => {
  const props = createProps();
  render(<PopUpIssuesReported {...props} />);
  const popupElement = screen.getByTestId("popIssues-1"); // Ensure this matches your component's test ID
  expect(popupElement).toBeInTheDocument();
});

test('should render the correct title', () => {
  const props = createProps({ title: 'Custom Title' });
  render(<PopUpIssuesReported {...props} />);
  const titleElement = screen.getByText(/Custom Title/i);
  expect(titleElement).toBeInTheDocument();
});

test('should render the correct user', () => {
  const props = createProps({ user: 'Jane Doe' });
  render(<PopUpIssuesReported {...props} />);
  const userElement = screen.getByText(/Jane Doe/i);
  expect(userElement).toBeInTheDocument();
});

test('should render the correct date', () => {
  const props = createProps({ date: '2024-10-01' });
  render(<PopUpIssuesReported {...props} />);
  const dateElement = screen.getByText(/2024-10-01/i);
  expect(dateElement).toBeInTheDocument();
});

test('should render the correct time', () => {
  const props = createProps({ time: '16:00' });
  render(<PopUpIssuesReported {...props} />);
  const timeElement = screen.getByText(/16:00/i);
  expect(timeElement).toBeInTheDocument();
});

test('should render the correct venue', () => {
  const props = createProps({ venue: 'Secondary Hall' });
  render(<PopUpIssuesReported {...props} />);
  const venueElement = screen.getByText(/Secondary Hall/i);
  expect(venueElement).toBeInTheDocument();
});

test('should render the correct room number', () => {
  const props = createProps({ room: '202' });
  render(<PopUpIssuesReported {...props} />);
  const roomElement = screen.getByText(/202/i);
  expect(roomElement).toBeInTheDocument();
});

test('should render the correct description', () => {
  const props = createProps({ description: 'Updated issue description.' });
  render(<PopUpIssuesReported {...props} />);
  const descriptionElement = screen.getByText(/Updated issue description./i);
  expect(descriptionElement).toBeInTheDocument();
});

test('should render the close button', () => {
  const props = createProps();
  render(<PopUpIssuesReported {...props} />);
  const closeButton = screen.getByRole('button', { name: /Close/i });
  expect(closeButton).toBeInTheDocument();
});

test('should call onClose when close button is clicked', () => {
  const handleClose = jest.fn();
  const props = createProps({ onClose: handleClose });
  render(<PopUpIssuesReported {...props} />);
  const closeButton = screen.getByRole('button', { name: /Close/i });
  fireEvent.click(closeButton);
  expect(handleClose).toHaveBeenCalledTimes(1);
});
*/