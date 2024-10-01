import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from './ProfilePage'; // Adjust the import path as necessary
import { useNavigate } from 'react-router-dom';

// Mock components used in Profile
jest.mock('../../components/NavigationHeader/NavigationHeader', () => ({ title, onClick }) => (
    <div data-testid="navigation-header" onClick={onClick}>
        {title}
    </div>
));

jest.mock('../../components/LogOutButton/LogOutButton', () => () => (
    <button>Logout</button>
));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(), // Mock useNavigate directly
}));

describe('Profile Component', () => {
    const userMock = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        picture: 'http://example.com/johndoe.jpg',
    };

    beforeAll(() => {
        // Mock localStorage
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => JSON.stringify(userMock)),
            },
            writable: true,
        });
    });

    afterAll(() => {
        // Clean up localStorage mock
        jest.restoreAllMocks();
    });

    test('renders profile with user data', () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        // Check if user data is displayed
        expect(screen.getByText(/name:/i)).toBeInTheDocument(); // Ensure the label is present
        expect(screen.getByText(userMock.name)).toBeInTheDocument(); // Check the actual name
        expect(screen.getByText(/email:/i)).toBeInTheDocument(); // Ensure the email label is present
        expect(screen.getByText(userMock.email)).toBeInTheDocument(); // Check the actual email
        expect(screen.getByRole('img', { name: userMock.name })).toHaveAttribute('src', userMock.picture); // Check the image source
    });

    test('displays fallback image on error', () => {
        // Update userMock to use a broken image URL
        const brokenUserMock = { ...userMock, picture: 'http://example.com/broken.jpg' };

        // Mock localStorage with broken image
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(() => JSON.stringify(brokenUserMock)),
            },
            writable: true,
        });

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        const imgElement = screen.getByRole('img', { name: brokenUserMock.name });

        // Trigger the error event
        fireEvent.error(imgElement);

        // Check if the fallback image is displayed
        const expectedFallbackSrc = `${window.location.origin}/fallback-image-url.jpg`; // Get the full URL
        expect(imgElement.src).toBe(expectedFallbackSrc); // Compare with the full URL
    });

    test('navigates back on header click', () => {
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock); // Use the mock implementation

        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        // Simulate clicking the back button
        fireEvent.click(screen.getByTestId('navigation-header'));

        // Verify that the navigation function was called
        expect(navigateMock).toHaveBeenCalledWith(-1); // Check if navigate(-1) was called
    });

    test('renders logout button', () => {
        render(
            <MemoryRouter>
                <Profile />
            </MemoryRouter>
        );

        // Check if the logout button is rendered
        expect(screen.getByText('Logout')).toBeInTheDocument(); // Check for the presence of Logout button
    });
});
