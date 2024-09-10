import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Popup from './ExistingVenuePopup';

describe('Popup Component', () => {
  test('renders popup with correct text', () => {
    // Render the component
    render(<Popup onClose={() => {}} />);

    // Check that the overlay, title, message, and button are present using data-testid
    expect(screen.getByTestId('popup-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('popup-content')).toBeInTheDocument();
    expect(screen.getByTestId('popup-title')).toHaveTextContent('The venue you are trying to add already exists.');
    expect(screen.getByTestId('popup-message')).toHaveTextContent('Please check the details and try again.');
    expect(screen.getByTestId('popup-close-button')).toBeInTheDocument();
  });

  test('calls onClose when Close button is clicked', () => {
    // Create a mock function for onClose
    const onCloseMock = jest.fn();

    // Render the component with the mock function passed as a prop
    render(<Popup onClose={onCloseMock} />);

    // Click the Close button
    fireEvent.click(screen.getByTestId('popup-close-button'));

    // Check that onClose was called once
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
