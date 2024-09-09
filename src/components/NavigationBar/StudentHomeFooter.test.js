import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from './StudentHomeFooter';

test('should render Footer component with 4 buttons and images', () => {
  // Arrange: Render the Footer component
  render(<Footer />);

  // Act: Find the buttons and images using roles and alt text
  const buttons = screen.getAllByRole('button');
  const homeImage = screen.getByAltText('Home');
  const squareImage = screen.getByAltText('Square');
  const hornImage = screen.getByAltText('Horn');
  const userImage = screen.getByAltText('User');

  // Assert: Check if 4 buttons are rendered
  expect(buttons).toHaveLength(4);

  // Assert: Check if the images are in the document and have correct alt text
  expect(homeImage).toBeInTheDocument();
  expect(squareImage).toBeInTheDocument();
  expect(hornImage).toBeInTheDocument();
  expect(userImage).toBeInTheDocument();
});
