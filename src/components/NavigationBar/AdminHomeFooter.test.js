import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../components/NavigationBar/AdminHomeFooter'; // Adjust import path as needed

test('should render the footer component', () => {
  render(<Footer />);
  const footerElement = screen.getByTestId('Footer-1');
  expect(footerElement).toBeInTheDocument();
});

test('should render the Home button with correct image and alt text', () => {
  render(<Footer />);
  const homeButton = screen.getByTestId('home-btn');
  const homeImage = screen.getByTestId('home-img');

  expect(homeButton).toBeInTheDocument();
  expect(homeImage).toBeInTheDocument();
  expect(homeImage).toHaveAttribute('alt', 'Home');
  expect(homeImage).toHaveAttribute('src', expect.stringContaining('test-file-stub'));
});

test('should render the Square button with correct image and alt text', () => {
  render(<Footer />);
  const squareButton = screen.getByTestId('square-btn');
  const squareImage = screen.getByTestId('square-img');

  expect(squareButton).toBeInTheDocument();
  expect(squareImage).toBeInTheDocument();
  expect(squareImage).toHaveAttribute('alt', 'Square');
  expect(squareImage).toHaveAttribute('src', expect.stringContaining('test-file-stub'));
});

test('should render the User button with correct image and alt text', () => {
  render(<Footer />);
  const userButton = screen.getByTestId('user-btn');
  const userImage = screen.getByTestId('user-img');

  expect(userButton).toBeInTheDocument();
  expect(userImage).toBeInTheDocument();
  expect(userImage).toHaveAttribute('alt', 'User');
  expect(userImage).toHaveAttribute('src', expect.stringContaining('test-file-stub'));
});
