import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudentHeader from './StudentHomeHeader';

test('should render StudentHeader component with an image and heading', () => {
  // Arrange: Render the StudentHeader component
  render(<StudentHeader />);

  // Act: Find the image and heading elements
  const imageElement = screen.getByAltText('Page Icon');
  const headingElement = screen.getByRole('heading', { level: 1 });

  // Assert: Check if the image and heading are in the document
  expect(imageElement).toBeInTheDocument();
  expect(headingElement).toBeInTheDocument();
  expect(headingElement).toHaveTextContent('Home');
});
