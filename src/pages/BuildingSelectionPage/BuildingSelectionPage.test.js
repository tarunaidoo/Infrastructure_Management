import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent} from '@testing-library/react';
import BuildingSelectionPage from './BuildingSelectionPage';
import { useQuery } from 'react-query';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock dependencies
jest.mock('react-query', () => ({
    useQuery: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock('../../components/NavigationHeader/NavigationHeader', () => jest.fn(({ onClick }) => (
    <div data-testid="header" onClick={onClick}>Header</div>
)));

jest.mock('../../components/BuildingCard/BuildingCard', () => jest.fn(({ onClick }) => (
    <div data-testid="building-card" onClick={onClick}>Building Card</div>
)));

jest.mock('../../components/LoadingComponent/LoadingComponent', () => jest.fn(() => (
    <div data-testid="loading">Loading...</div>
)));


describe('BuildingSelectionPage', () => {
    const mockNavigate = jest.fn();
    const mockLocation = {
        state: {
            CAMPUS_NAME: 'East Campus',
        },
    };

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state while fetching buildings', () => {
        useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            error: null,
        });

        render(
            <BuildingSelectionPage />
        );

        // Assert that loading component is shown
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should display an error message if buildings fail to load', async () => {
        useQuery.mockReturnValue({
            data: null,
            isLoading: false,
            error: { message: 'Failed to load buildings' },
        });

        render(
            <BuildingSelectionPage />
        );

        // Assert that the error message is displayed
        expect(screen.getByText(/An error occurred: Failed to load buildings/i)).toBeInTheDocument();
    });

    it('should render building cards when data is successfully fetched', async () => {
        const buildingsData = [
            { BUILDING_ID: '1', BUILDING_NAME: 'Building A', TAGS: ['Tag1', 'Tag2'] },
            { BUILDING_ID: '2', BUILDING_NAME: 'Building B', TAGS: ['Tag3'] },
        ];

        useQuery.mockReturnValue({
            data: buildingsData,
            isLoading: false,
            error: null,
        });

        render(
            <BuildingSelectionPage />
        );

        // Assert that the building cards are rendered
        const buildingCards = screen.getAllByTestId('building-card');
        expect(buildingCards.length).toBe(2);
    });

    it('should navigate to campus selection when header back icon is clicked', () => {
        useQuery.mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });

        render(
            <BuildingSelectionPage />
        );

        const header = screen.getByTestId('header');
        fireEvent.click(header);

        // Assert that navigate was called with the correct arguments
        expect(mockNavigate).toHaveBeenCalledWith('/campus-selection', { state: mockLocation.state });
    });

    it('should navigate to room selection when a building card is clicked', async () => {
        const buildingsData = [
            { BUILDING_ID: '1', BUILDING_NAME: 'Building A', TAGS: ['Tag1', 'Tag2'] },
        ];

        useQuery.mockReturnValue({
            data: buildingsData,
            isLoading: false,
            error: null,
        });

        render(
            <BuildingSelectionPage />
        );

        const buildingCard = screen.getByTestId('building-card');
        fireEvent.click(buildingCard);

        // Assert that navigate was called with the correct arguments
        expect(mockNavigate).toHaveBeenCalledWith('/room-selection', {
            state: {
                ...mockLocation.state,
                BUILDING_ID: '1',
                BUILDING_NAME: 'Building A',
            },
        });
    });
});
