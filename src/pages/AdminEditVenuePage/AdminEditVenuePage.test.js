import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AdminEditVenuePage from './AdminEditVenuePage';
import { getVenue, getFeatures, getFeatureNames, updateVenue, updateVenueFeatures } from '../../services/AdminEditVenuePage/AdminEditVenuePage.service';

jest.mock('../../services/AdminEditVenuePage/AdminEditVenuePage.service', () => ({
  getVenue: jest.fn(),
  getFeatures: jest.fn(),
  getFeatureNames: jest.fn(),
  updateVenue: jest.fn(),
  updateVenueFeatures: jest.fn(),
}));

jest.mock('../../components/Popup/Popup', () => ({ trigger, children }) => (
  <div data-testid="popup">
    {trigger && <div>{children}</div>}
  </div>
));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

const mockNavigate = jest.fn();

describe('AdminEditVenuePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementation
    getVenue.mockResolvedValue({
      venue_id: '1',
      venue_name: 'Test Venue',
      venue_capacity: '100',
      venue_status: 'Available'
    });

    getFeatures.mockResolvedValue({
      featureDetails: [
        { ROOM_FEATURE_ID: '1', FEATURE_ID: 'feature1' },
        { ROOM_FEATURE_ID: '2', FEATURE_ID: 'feature2' }
      ]
    });

    getFeatureNames.mockResolvedValue([
      { FEATURE_ID: 'feature1', FEATURE_NAME: 'Feature 1' },
      { FEATURE_ID: 'feature2', FEATURE_NAME: 'Feature 2' }
    ]);

    updateVenue.mockResolvedValue({});
    updateVenueFeatures.mockResolvedValue({});

    useNavigate.mockImplementation(() => mockNavigate);
  });

  let mockLocationState;

  beforeEach(() => {
    // Mock the location state
    mockLocationState = {
      VENUE_NAME: 'Test Venue',
      SOURCE_PAGE: 'source',
      USER_ID: 'user123',
      DESTINATION_PAGE: 'destination',
      CAMPUS_NAME: 'Campus A',
      BUILDING_ID: 'building123',
      BUILDING_NAME: 'Building 1',
      features: [
        { FEATURE_ID: 1, FEATURE_NAME: 'Feature 1' },
        { FEATURE_ID: 2, FEATURE_NAME: 'Feature 2' }
      ],
      capacity: 100,
      isAvailable: true
    };
  });

  test('renders all main elements of the AdminEditVenuePage', () => {
    render(
      <MemoryRouter initialEntries={[{ state: mockLocationState }]}>
        <AdminEditVenuePage />
      </MemoryRouter>
    );

    // Check if the layout is rendered
    expect(screen.getByTestId('edit-venue-layout')).toBeInTheDocument();

    // Check if the heading section is rendered
    expect(screen.getByTestId('edit-venue-heading')).toBeInTheDocument();
    expect(screen.getByTestId('edit-venue-heading-text')).toHaveTextContent('Edit a Venue');
    expect(screen.getByTestId('back-arrow-icon')).toBeInTheDocument();

    // Check if the form and its sections are rendered
    expect(screen.getByTestId('edit-venue-container')).toBeInTheDocument();
    expect(screen.getByTestId('edit-venue-form')).toBeInTheDocument();

    // Check building name section
    expect(screen.getByTestId('building-name-section')).toBeInTheDocument();
    expect(screen.getByTestId('building-name')).toBeInTheDocument();

    // Check venue name input
    expect(screen.getByTestId('venue-name-section')).toBeInTheDocument();
    expect(screen.getByTestId('venue-name-input')).toBeInTheDocument();

    // Check capacity input
    expect(screen.getByTestId('capacity-section')).toBeInTheDocument();
    expect(screen.getByTestId('capacity-input')).toBeInTheDocument();

    // Check availability switch
    expect(screen.getByTestId('availability-section')).toBeInTheDocument();
    expect(screen.getByTestId('availability-switch')).toBeInTheDocument();

    // Check features section and checkboxes
    expect(screen.getByTestId('features-section')).toBeInTheDocument();
    expect(screen.getByTestId('features-checkboxes')).toBeInTheDocument();

    // Check update venue button
    expect(screen.getByTestId('update-venue-button')).toBeInTheDocument();

    // Check popup and its various types
    expect(screen.getByTestId('popup')).toBeInTheDocument();
  });
});
