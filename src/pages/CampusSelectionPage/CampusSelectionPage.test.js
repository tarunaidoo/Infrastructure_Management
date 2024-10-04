import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import CampusSelectionPage from './CampusSelectionPage';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock dependencies
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('../../components/NavigationHeader/NavigationHeader', () => jest.fn(({ onClick }) => (
    <div data-testid="header" onClick={onClick}>Header</div>
)));
jest.mock('../../components/CampusCard/CampusCard', () => jest.fn(({ onClick }) => (
    <div data-testid="campus-card" onClick={onClick}>Campus Card</div>
)));


describe('CampusSelectionPage', () => {
    const mockNavigate = jest.fn();
    const mockLocation = {
        state: {
            SOURCE_PAGE: '/previous-page',
        },
    };

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render header and campus cards', () => {
        render(
            <CampusSelectionPage />
        );

        // Assert that the header is rendered
        expect(screen.getByTestId('header')).toBeInTheDocument();

        // Assert that two campus cards are rendered
        const campusCards = screen.getAllByTestId('campus-card');
        expect(campusCards.length).toBe(2);
    });

    it('should navigate back when header back icon is clicked', () => {
        render(
            <CampusSelectionPage />
        );

        const header = screen.getByTestId('header');
        fireEvent.click(header);

        // Assert that navigate was called with correct arguments
        expect(mockNavigate).toHaveBeenCalledWith('/previous-page', { state: mockLocation.state });
    });

    it('should navigate to building selection page when a campus card is clicked', () => {
        render(
            <CampusSelectionPage />
        );

        const campusCards = screen.getAllByTestId('campus-card');

        // Simulate clicking the first campus card (East Campus)
        fireEvent.click(campusCards[0]);

        // Assert that navigate was called with correct arguments
        expect(mockNavigate).toHaveBeenCalledWith('/building-selection', {
            state: { ...mockLocation.state, CAMPUS_NAME: 'East Campus' },
        });

        // Simulate clicking the second campus card (West Campus)
        fireEvent.click(campusCards[1]);

        // Assert that navigate was called with correct arguments
        expect(mockNavigate).toHaveBeenCalledWith('/building-selection', {
            state: { ...mockLocation.state, CAMPUS_NAME: 'West Campus' },
        });
    });
});
