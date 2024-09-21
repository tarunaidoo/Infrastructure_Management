import React from "react";
import "@testing-library/jest-dom";
import { render } from '@testing-library/react';

import LoadingComponent from './LoadingComponent';

// Mock the PropagateLoader from react-spinners
jest.mock('react-spinners', () => ({
    PropagateLoader: ({ color, size, loading }) => (
        <div data-testid="spinner" style={{ color, fontSize: size }} aria-busy={loading}></div>
    ),
}));

describe('LoadingComponent', () => {
    it('soulde render with the correct color, size, and loading state', () => {
        const color = 'red';
        const size = 15;
        const isLoading = true;

        const { getByTestId } = render(<LoadingComponent colour={color} size={size} isLoading={isLoading} />);

        const spinner = getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveStyle(`color: ${color}`);
        expect(spinner).toHaveStyle(`font-size: ${size}px`);
        expect(spinner).toHaveAttribute('aria-busy', `${isLoading}`);
    });

    it('should not render the spinner when isLoading is false', () => {
        const color = 'blue';
        const size = 20;
        const isLoading = false;

        const { queryByTestId } = render(<LoadingComponent colour={color} size={size} isLoading={isLoading} />);

        const spinner = queryByTestId('spinner');
        expect(spinner).toBeInTheDocument(); // Spinner is still rendered but not loading
        expect(spinner).toHaveAttribute('aria-busy', `${isLoading}`);
    });
});
