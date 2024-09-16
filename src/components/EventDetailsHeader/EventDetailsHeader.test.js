import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Header from './EventDetailsHeader';

test('should render Header component with back button and heading', () => {
  // Arrange: Render the Header component inside MemoryRouter to handle routing
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );

  // Act: Find the image and heading elements
  const backButtonImage = screen.getByAltText('Event-Icon');
  const headingElement = screen.getByRole('heading', { level: 1 });

  // Assert: Check if the back button image and heading are in the document
  expect(backButtonImage).toBeInTheDocument();
  expect(headingElement).toBeInTheDocument();
  expect(headingElement).toHaveTextContent('Event Details');
});
