import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminHomePage from './AdminHomePage';
import { useNavigate } from 'react-router-dom';

// Mock the necessary components and assets
jest.mock('../../components/AdminIssuesCard/AdminIssuesCard', () => ({ onClick }) => (
    <div role="button" onClick={onClick} data-testid="issues-card">Issues Card</div>
));

jest.mock('../../components/AdminEventsCard/AdminEventsCard', () => ({ onClick }) => (
    <div role="button" onClick={onClick} data-testid="events-card">Events Card</div>
));

jest.mock('../../components/NavigationBar/AdminHomeFooter', () => ({ onAddVenueClick, onEditVenueClick, onProfileClick }) => (
    <footer>
        <button onClick={onAddVenueClick}>Add Venue</button>
        <button onClick={onEditVenueClick}>Edit Venue</button>
        <button onClick={onProfileClick}>Profile</button>
    </footer>
));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('AdminHomePage', () => {
    const navigate = jest.fn(); // Mock navigate function

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        localStorage.setItem('userEmail', 'test@example.com'); // Mock userEmail
        useNavigate.mockReturnValue(navigate); // Mock the navigate function
    });

    test('navigates to the correct pages when cards and footer buttons are clicked', async () => { // Make the function async
        render(
            <MemoryRouter>
                <AdminHomePage loading={false}/>
            </MemoryRouter>
        );

        // Wait for the Issues Card to appear before interacting with it
        const issuesCard = await screen.findByTestId('issues-card');
        fireEvent.click(issuesCard);
        expect(navigate).toHaveBeenCalledWith('/admin-issues-reported');
        expect(navigate).toHaveBeenCalledTimes(1);

        // Simulate clicking the Events Card
        fireEvent.click(screen.getByTestId('events-card'));
        expect(navigate).toHaveBeenCalledWith('/admin-view-booking');
        expect(navigate).toHaveBeenCalledTimes(2);

        // Simulate clicking Add Venue button
        fireEvent.click(screen.getByRole('button', { name: /add venue/i }));
        expect(navigate).toHaveBeenCalledWith('/admin-add-venue');
        expect(navigate).toHaveBeenCalledTimes(3);

        // Simulate clicking Edit Venue button
        fireEvent.click(screen.getByRole('button', { name: /edit venue/i }));
        expect(navigate).toHaveBeenCalledWith('/campus-selection', { state: { SOURCE_PAGE: "/admin-home", USER_ID: 'test@example.com', DESTINATION_PAGE: "/edit-venue" } });
        expect(navigate).toHaveBeenCalledTimes(4);

        // Simulate clicking Profile button
        fireEvent.click(screen.getByRole('button', { name: /profile/i }));
        expect(navigate).toHaveBeenCalledWith('/profile');
        expect(navigate).toHaveBeenCalledTimes(5);
    });
});
