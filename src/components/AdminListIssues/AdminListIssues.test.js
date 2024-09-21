import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminListIssues from './AdminListIssues';

describe('AdminListIssues Component', () => {
  
  test('calls onClick when card is clicked', () => {
    const mockOnClick = jest.fn();

    render(
      <AdminListIssues 
        title="Test Issue"
        venueName="Test Venue" 
        date="2024-09-20" 
        onClick={mockOnClick} 
      />
    );

    // Click the card
    fireEvent.click(screen.getByTestId('admin-issues-card'));

    // Ensure onClick was called once
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('renders the title correctly', () => {
    render(
      <AdminListIssues 
        title="Test Issue"
        venueName="Test Venue" 
        date="2024-09-20" 
        onClick={() => {}} 
      />
    );

    // Verify the title is rendered correctly
    expect(screen.getByTestId('card-title')).toHaveTextContent('Test Issue');
  });

  test('renders venue name correctly', () => {
    render(
      <AdminListIssues 
        title="Test Issue"
        venueName="Test Venue" 
        date="2024-09-20" 
        onClick={() => {}} 
      />
    );

    // Verify the venue name is rendered correctly
    expect(screen.getByText(/Venue:/)).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
  });

  test('renders date correctly', () => {
    render(
      <AdminListIssues 
        title="Test Issue"
        venueName="Test Venue" 
        date="2024-09-20" 
        onClick={() => {}} 
      />
    );

    // Verify the date is rendered correctly
    expect(screen.getByText(/Date Reported:/)).toBeInTheDocument();
    expect(screen.getByText('2024-09-20')).toBeInTheDocument();
  });

  test('renders the info icon correctly', () => {
    render(
      <AdminListIssues 
        title="Test Issue"
        venueName="Test Venue" 
        date="2024-09-20" 
        onClick={() => {}} 
      />
    );

    // Verify the info icon is rendered with the correct alt text
    expect(screen.getByAltText('Info')).toBeInTheDocument();
  });

});
