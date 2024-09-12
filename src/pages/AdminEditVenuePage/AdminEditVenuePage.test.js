import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import AdminEditVenuePage from './AdminEditVenuePage';

// Mocking the services
jest.mock('../../services/AdminEditVenuePage/AdminEditVenuePage.service', () => ({
    getBuilding: jest.fn(() => Promise.resolve({ building_name: 'Mathematical Science Labs', building_id: '123' })),
    getVenue: jest.fn(() => Promise.resolve({
        venue_id: '456',
        venue_name: 'MSL004',
        venue_capacity: 100,
        venue_status: 'Available'
    })),
    getFeatures: jest.fn(() => Promise.resolve({
        featureDetails: [
            { ROOM_FEATURE_ID: 1, FEATURE_ID: 101 },
            { ROOM_FEATURE_ID: 2, FEATURE_ID: 102 }
        ]
    })),
    getFeatureNames: jest.fn(() => Promise.resolve([
        { FEATURE_ID: 101, FEATURE_NAME: 'Projector' },
        { FEATURE_ID: 102, FEATURE_NAME: 'Whiteboard' }
    ])),
    updateVenue: jest.fn(),
    updateVenueFeatures: jest.fn(),
}));

describe('AdminEditVenuePage Component', () => {
    it('renders static elements correctly', async () => {
        render(<AdminEditVenuePage />);
        
        // Check that heading and labels are rendered after async data loads
        expect(await screen.findByText(/Edit a Venue/i)).toBeInTheDocument();
        expect(await screen.findByText(/Building:/i)).toBeInTheDocument();
        expect(await screen.findByText(/Venue Name:/i)).toBeInTheDocument();
        expect(await screen.findByText(/Capacity:/i)).toBeInTheDocument();
        expect(await screen.findByText(/Availability:/i)).toBeInTheDocument();
        expect(await screen.findByText(/Features:/i)).toBeInTheDocument();
    });

    it('renders venue name and capacity inputs correctly', async () => {
        render(<AdminEditVenuePage />);

        // Wait for the venue name and capacity inputs to appear
        const venueInput = await screen.findByDisplayValue('MSL004');
        const capacityInput = await screen.findByDisplayValue('100');
        
        expect(venueInput).toBeInTheDocument();
        expect(capacityInput).toBeInTheDocument();
    });

    it('toggles availability switch correctly', async () => {
        render(<AdminEditVenuePage />);

        // Select the availability switch using getByLabelText
        const availabilitySwitch = await screen.findByRole('switch');
        
        expect(availabilitySwitch).toBeChecked(); // Initially 'Available'
        fireEvent.click(availabilitySwitch);
        expect(availabilitySwitch).not.toBeChecked(); // After toggling, should be 'Unavailable'
    });

    it('checks and unchecks feature checkboxes correctly', async () => {
        render(<AdminEditVenuePage />);
        
        // Wait for the checkboxes to appear
        const projectorCheckbox = await screen.findByLabelText('Projector');
        const whiteboardCheckbox = await screen.findByLabelText('Whiteboard');

        expect(projectorCheckbox.checked).toBe(true); // Initially checked
        expect(whiteboardCheckbox.checked).toBe(true); // Initially checked
        
        // Toggle projector off
        fireEvent.click(projectorCheckbox);
        expect(projectorCheckbox.checked).toBe(false); 
        
        // Toggle whiteboard off
        fireEvent.click(whiteboardCheckbox);
        expect(whiteboardCheckbox.checked).toBe(false);
    });

    it('submits form and updates venue correctly', async () => {
        render(<AdminEditVenuePage />);

        // Wait for elements to appear and fill in new values
        const venueInput = await screen.findByDisplayValue('MSL004');
        fireEvent.change(venueInput, { target: { value: 'New Venue Name' } });

        const capacityInput = await screen.findByDisplayValue('100');
        fireEvent.change(capacityInput, { target: { value: '150' } });

        const projectorCheckbox = await screen.findByLabelText('Projector');
        fireEvent.click(projectorCheckbox); // Toggle off

        // Submit form
        const updateButton = screen.getByText('Update Venue');
        fireEvent.click(updateButton);

        // Validate that the changes are reflected
        expect(venueInput.value).toBe('New Venue Name');
        expect(capacityInput.value).toBe('150');
        expect(projectorCheckbox.checked).toBe(false);
    });
});
