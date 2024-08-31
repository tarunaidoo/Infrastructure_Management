import React from 'react';
import { render, screen } from '@testing-library/react';
import NavigationHeader from './NavigationHeader';
import '@testing-library/jest-dom';

test('should render NavigationHeader', () => {
    render(<NavigationHeader />);
    const NavigationHeaderElement = screen.getByTestId('NavigationHeader-1');
    expect(NavigationHeaderElement).toBeInTheDocument();
});

test('should display the correct text through prop', () => {
    const testText = "My Navigation Header";
    render(<NavigationHeader title={testText} />);
    const textElement = screen.getByText(testText);
    expect(textElement).toBeInTheDocument();
});
