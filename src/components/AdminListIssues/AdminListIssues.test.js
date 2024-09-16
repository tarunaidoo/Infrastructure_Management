import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminListIssues from './AdminListIssues';

describe('AdminListIssues Component', () => {
  
  test('renders card with correct venue name and block/unblock button', () => {
    const mockOnClick = jest.fn();
    const mockOnBlockRoom = jest.fn();
    const tesdate = '2024-09-12';

    render(
      <AdminListIssues 
      title="Test Venue"  
      venueName="Test Venue"
        date={tesdate}
        isBlocked={false} 
        onClick={mockOnClick} 
        onBlockRoom={mockOnBlockRoom} 
      />
    );

    // Verify the venue name is displayed
    expect(screen.getByTestId('card-title')).toHaveTextContent('Test Venue');

    // Verify the Block button is rendered
    expect(screen.getByTestId('block-room-button')).toHaveTextContent('Block');
  });

  test('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();
    const mockOnBlockRoom = jest.fn();

    render(
      <AdminListIssues 
        venueName="Test Venue" 
        isBlocked={false} 
        onClick={mockOnClick} 
        onBlockRoom={mockOnBlockRoom} 
      />
    );

    // Click the card
    fireEvent.click(screen.getByTestId('admin-issues-card'));

    // Ensure onClick was called once
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('calls onBlockRoom when Block/Unblock button is clicked', () => {
    const mockOnClick = jest.fn();
    const mockOnBlockRoom = jest.fn();

    render(
      <AdminListIssues 
        venueName="Test Venue" 
        isBlocked={false} 
        onClick={mockOnClick} 
        onBlockRoom={mockOnBlockRoom} 
      />
    );

    // Click the Block button
    fireEvent.click(screen.getByTestId('block-room-button'));

    // Ensure onBlockRoom was called once
    expect(mockOnBlockRoom).toHaveBeenCalledTimes(1);

    // Ensure the card click was not triggered
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('displays Unblock when isBlocked is true', () => {
    const mockOnClick = jest.fn();
    const mockOnBlockRoom = jest.fn();

    render(
      <AdminListIssues 
        venueName="Test Venue" 
        isBlocked={true} 
        onClick={mockOnClick} 
        onBlockRoom={mockOnBlockRoom} 
      />
    );

    // Verify the Unblock button is rendered
    expect(screen.getByTestId('block-room-button')).toHaveTextContent('Unblock');
  });

  test('renders the info icon correctly', () => {
    const mockOnClick = jest.fn();
    const mockOnBlockRoom = jest.fn();
  
    render(
      <AdminListIssues 
        venueName="Test Venue" 
        isBlocked={false} 
        onClick={mockOnClick} 
        onBlockRoom={mockOnBlockRoom} 
      />
    );
  
    // Verify the info icon is rendered with the correct alt text
    expect(screen.getByAltText('Info')).toBeInTheDocument();
  });
  
  test('block-room-button text toggles based on isBlocked prop', () => {
    const mockOnClick = jest.fn();
    const mockOnBlockRoom = jest.fn();
  
    // Test with isBlocked false
    const { rerender } = render(
      <AdminListIssues 
        venueName="Test Venue" 
        isBlocked={false} 
        onClick={mockOnClick} 
        onBlockRoom={mockOnBlockRoom} 
      />
    );
  
    expect(screen.getByTestId('block-room-button')).toHaveTextContent('Block');
  
    // Re-render with isBlocked true
    rerender(
      <AdminListIssues 
        venueName="Test Venue" 
        isBlocked={true} 
        onClick={mockOnClick} 
        onBlockRoom={mockOnBlockRoom} 
      />
    );
  
    expect(screen.getByTestId('block-room-button')).toHaveTextContent('Unblock');
  });
  

});
