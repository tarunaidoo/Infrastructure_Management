// LoadingComponent.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingComponent from './LoadingComponent'; // Adjust the import path as necessary
import '@testing-library/jest-dom'; // for additional matchers like toBeInTheDocument

test('renders LoadingComponent with loading icon and text', () => {
  render(<LoadingComponent />);
  
  // Check if the loading icon is rendered
  const loadIcon = screen.getByAltText('loadIcon');
  expect(loadIcon).toBeInTheDocument();
  
  // Check if the text "Connecting..." is rendered
  const loadingText = screen.getByText('Connecting...');
  expect(loadingText).toBeInTheDocument();
});