import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomSelectionPage from './RoomSelectionPage';
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

jest.mock('../../components/RoomCard/RoomCard', () => {
    return jest.fn(({ roomName, onClick, children }) => (
        <div data-testid="room-card" onClick={onClick}>
            <h2>{roomName}</h2>
            {children}
        </div>
    ));
});

jest.mock('../../components/LoadingComponent/LoadingComponent', () => jest.fn(() => (
    <div data-testid="loading">Loading...</div>
)));

jest.mock('../../components/Popup/Popup', () => jest.fn(({ children }) => (
    <div data-testid="popup">{children}</div>
)));

describe('RoomSelectionPage', () => {
    const mockNavigate = jest.fn();
    const mockLocation = {
        state: {
            USER_ID: '1',
            BUILDING_ID: '2',
            DESTINATION_PAGE: '/booking',
        },
    };

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);
        useQuery.mockReturnValue({
            data: { USER_ROLE: 'student' }, // Adjust the mock as needed
            isLoading: false,
            error: null
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render loading state while fetching user details and venues', () => {
        useQuery
            .mockReturnValueOnce({ isLoading: true }) // For userDetails query
            .mockReturnValueOnce({ isLoading: true }); // For venue query

        render(<RoomSelectionPage />);

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should display an error message if user details fail to load', () => {
        useQuery
            .mockReturnValueOnce({ error: { message: 'Failed to load user details' }, isLoading: false }) // For userDetails query
            .mockReturnValueOnce({ data: [], isLoading: false }); // For venue query

        render(<RoomSelectionPage />);

        expect(screen.getByText(/An error occurred: Failed to load user details/i)).toBeInTheDocument();
    });

    it('should display an error message if venues fail to load', () => {
        useQuery
            .mockReturnValueOnce({ data: { USER_ROLE: 'admin' }, isLoading: false }) // For userDetails query
            .mockReturnValueOnce({ error: { message: 'Failed to load venues' }, isLoading: false }); // For venue query

        render(<RoomSelectionPage />);

        expect(screen.getByText(/An error occurred: Failed to load venues/i)).toBeInTheDocument();
    });

    it('should render room cards when venue data is successfully fetched', () => {
        const venuesData = [
            { VENUE_ID: '1', VENUE_NAME: 'Room A', FEATURES: [] },
            { VENUE_ID: '2', VENUE_NAME: 'Room B', FEATURES: [] },
        ];

        useQuery
            .mockReturnValueOnce({ data: { USER_ROLE: 'admin' }, isLoading: false }) // For userDetails query
            .mockReturnValueOnce({ data: venuesData, isLoading: false }); // For venue query

        render(<RoomSelectionPage />);

        const roomCards = screen.getAllByTestId('room-card');
        expect(roomCards.length).toBe(2);
        expect(roomCards[0]).toHaveTextContent('Room A');
        expect(roomCards[1]).toHaveTextContent('Room B');
    });

    it('should navigate to the building selection page when the header back icon is clicked', () => {
        useQuery
            .mockReturnValueOnce({ data: { USER_ROLE: 'admin' }, isLoading: false }) // For userDetails query
            .mockReturnValueOnce({ data: [], isLoading: false }); // For venue query

        render(<RoomSelectionPage />);

        const header = screen.getByTestId('header');
        fireEvent.click(header);

        expect(mockNavigate).toHaveBeenCalledWith('/building-selection', { state: mockLocation.state });
    });

    it('should navigate to the booking page when a room card is clicked', () => {
        const venuesData = [
            { VENUE_ID: '1', VENUE_NAME: 'Room A', FEATURES: [] },
        ];

        useQuery
            .mockReturnValueOnce({ data: { USER_ROLE: 'admin' }, isLoading: false }) // For userDetails query
            .mockReturnValueOnce({ data: venuesData, isLoading: false }); // For venue query

        render(<RoomSelectionPage />);

        const roomCard = screen.getByTestId('room-card');
        fireEvent.click(roomCard);

        expect(mockNavigate).toHaveBeenCalledWith('/booking', {
            state: {
                ...mockLocation.state,
                VENUE_ID: '1',
                VENUE_NAME: 'Room A',
            },
        });
    });

    it('should open the popup when the question icon is clicked', () => {
        const venuesData = [
            { VENUE_ID: '1', VENUE_NAME: 'Room A', FEATURES: [{ FEATURE_ID: '1', FEATURE_NAME: 'Projector' }] },
        ];

        useQuery
            .mockReturnValue({ data: { USER_ROLE: 'student' }, isLoading: false }) // For userDetails query
            .mockReturnValue({ data: venuesData, isLoading: false }); // For venue query

        render(<RoomSelectionPage />);

        const questionIcon = screen.getByAltText('circle question mark icon');
        fireEvent.click(questionIcon);

        expect(screen.getByTestId('popup')).toBeInTheDocument();
        expect(screen.getByText('Room Features:')).toBeInTheDocument();
        expect(screen.getByText('Projector')).toBeInTheDocument();
    });

    it('should close the popup when the close button is clicked', () => {
        const venue = [
            { VENUE_ID: '1', VENUE_NAME: 'Room A', FEATURES: [{ FEATURE_ID: '1', FEATURE_NAME: 'Projector' }] }
        ];

        useQuery
            .mockReturnValue({ data: { USER_ROLE: 'admin' }, error: null, isLoading: false }) // For userDetails query
            .mockReturnValue({ data: venue, isLoading: false }); // For venue query

        render(<RoomSelectionPage />);

        const questionIcon = screen.getByAltText('circle question mark icon');
        fireEvent.click(questionIcon);

        const closeButton = screen.getByText('Close');
        fireEvent.click(closeButton);

        expect(screen.queryByTestId('popup')).not.toBeInTheDocument();
    });
});
