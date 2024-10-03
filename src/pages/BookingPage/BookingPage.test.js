import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; 
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
import BookingPage from './BookingPage'; // Adjust this import if needed



jest.mock('/home/vmuser/Desktop/Infrastructure_Management/src/services/BookingPage/BookingPage.service.jsx'); // Correct mock

describe('BookingPage Component', () => {
  const queryClient = new QueryClient(); 

  test('opens recurring booking popup on click', async () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <BookingPage />
        </QueryClientProvider>
      </MemoryRouter>
    );

    // Use findByText to wait for the button to appear
    const recurringButton = await screen.findByText(/open recurring booking/i); 
    fireEvent.click(recurringButton);

    // Check for the recurring booking popup
    expect(screen.getByText(/recurring booking popup content/i)).toBeInTheDocument();
  });
});
