import '@testing-library/jest-dom';
import { render, screen, fireEvent  } from '@testing-library/react';
import ReportIssue from './ReportIssue';
import { MemoryRouter,useNavigate} from 'react-router-dom';
import { createReportIssue } from '../../services/ReportIssuePage/ReportIssuePage.service';
import { QueryClient, QueryClientProvider } from 'react-query';
// Mock `useNavigate` and `useLocation` hooks from `react-router-dom`


jest.mock('../../services/ReportIssuePage/ReportIssuePage.service', () => ({
    createReportIssue: jest.fn()
  }));
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useLocation: () => ({
      state: {
        USER_ID: 1,
        BUILDING_ID: 2,
        BUILDING_NAME: "Building A",
        VENUE_ID: 101,
        VENUE_NAME: "Room 101",
        SOURCE_PAGE: '/home'
      }
    })
  }));

  
  
  describe('ReportIssue component', () => {
      // Create a QueryClient instance for each test
  const queryClient = new QueryClient();
    beforeEach(() => {
      jest.clearAllMocks(); // Clear previous mocks before each test
    });
    const renderWithQueryClient = (component) => {
      return render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{component}</MemoryRouter>
        </QueryClientProvider>
      );
    };
 
    it('renders the component with initial elements', () => {
      renderWithQueryClient(<ReportIssue />);
    
        // Check if the main layout is rendered
        expect(screen.getByTestId('report-issue-layout')).toBeInTheDocument();
    
        // Check if the heading section is rendered
        expect(screen.getByTestId('report-issue-heading')).toBeInTheDocument();
        expect(screen.getByTestId('report-issue-heading-text')).toHaveTextContent('Report an Issue');
        expect(screen.getByTestId('back-arrow-icon')).toBeInTheDocument();
    
        // Check if the date and venue information is displayed
        expect(screen.getByTestId('report-issue-date')).toBeInTheDocument();
        expect(screen.getByTestId('report-issue-venue-label')).toHaveTextContent('Venue:');
        expect(screen.getByTestId('report-issue-venue-details')).toBeInTheDocument();
        expect(screen.getByTestId('building-name')).toBeInTheDocument();
        expect(screen.getByTestId('venue-name')).toBeInTheDocument();
    
        // Check if the form elements are rendered
        expect(screen.getByTestId('report-issue-form')).toBeInTheDocument();
        expect(screen.getByTestId('issue-title-container')).toBeInTheDocument();
        expect(screen.getByTestId('issue-title-input')).toBeInTheDocument();
        expect(screen.getByTestId('issue-description-container')).toBeInTheDocument();
        expect(screen.getByTestId('issue-description-input')).toBeInTheDocument();
        expect(screen.getByTestId('report-issue-button')).toBeInTheDocument();
        expect(screen.getByTestId('warning-icon')).toBeInTheDocument();
      });

 it('handles form submission and shows error popup if fields are empty', () => {
  renderWithQueryClient(<ReportIssue />);

  // Trigger form submission
  fireEvent.submit(screen.getByTestId('report-issue-form'));

  // Check for error popup
  expect(screen.getByTestId('error-popup')).toBeInTheDocument();
  expect(screen.getByTestId('error-popup-heading')).toHaveTextContent('Invalid Details');
  expect(screen.getByTestId('error-popup-message')).toHaveTextContent('Please fill in all fields');
});

it('handles form submission and shows confirmation popup if fields are filled', () => {
  renderWithQueryClient(<ReportIssue />);

  // Fill form fields
  fireEvent.change(screen.getByTestId('issue-title-input'), { target: { value: 'Test Title' } });
  fireEvent.change(screen.getByTestId('issue-description-input'), { target: { value: 'Test Description' } });

  // Trigger form submission
  fireEvent.submit(screen.getByTestId('report-issue-form'));

  // Check for confirmation popup
  expect(screen.getByTestId('confirmation-popup')).toBeInTheDocument();
  expect(screen.getByTestId('confirmation-popup-heading')).toHaveTextContent('Confirmation');
  expect(screen.getByTestId('confirmation-popup-message')).toHaveTextContent('Do you want to report this issue?');
});

it('submitting form with missing fields triggers error popup', () => {
  renderWithQueryClient(<ReportIssue />);
    
    fireEvent.change(screen.getByTestId('issue-title-input'), { target: { value: '' } });
    fireEvent.change(screen.getByTestId('issue-description-input'), { target: { value: '' } });
    
    fireEvent.click(screen.getByTestId('report-issue-button'));
    
    expect(screen.getByTestId('error-popup')).toBeInTheDocument();
    expect(screen.getByTestId('error-popup-heading')).toHaveTextContent('Invalid Details');
    expect(screen.getByTestId('error-popup-message')).toHaveTextContent('Please fill in all fields');
  });

  it('submitting form with valid fields triggers confirmation popup', () => {
    renderWithQueryClient(<ReportIssue />);
    
    fireEvent.change(screen.getByTestId('issue-title-input'), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByTestId('issue-description-input'), { target: { value: 'Test Description' } });
    
    fireEvent.click(screen.getByTestId('report-issue-button'));
    
    expect(screen.getByTestId('confirmation-popup')).toBeInTheDocument();
    expect(screen.getByTestId('confirmation-popup-heading')).toHaveTextContent('Confirmation');
    expect(screen.getByTestId('confirmation-popup-message')).toHaveTextContent('Do you want to report this issue?');
  });

  it('renders the request error popup when popupType is "request-error"', async () => {
    // Mock createReportIssue to simulate an error
    createReportIssue.mockImplementation(() => Promise.reject(new Error('Request failed')));

    renderWithQueryClient(<ReportIssue />);

    // Simulate filling in the form
    fireEvent.change(screen.getByTestId('issue-title-input'), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByTestId('issue-description-input'), { target: { value: 'Test Description' } });

    // Submit the form to trigger the popup
    fireEvent.click(screen.getByTestId('report-issue-button'));

    // Simulate confirmation to trigger error popup
    fireEvent.click(await screen.findByTestId('confirmation-yes-button'));
    
    // Check if the loading popup is displayed
    expect(screen.getByTestId('loading-popup')).toBeInTheDocument();
    expect(screen.getByTestId('loading-popup-heading')).toHaveTextContent('Loading...');
    expect(screen.getByTestId('loading-popup-message')).toHaveTextContent('Please wait while we send your report.');

    // After a brief delay, check that the loading popup is gone
    await new Promise((resolve) => setTimeout(resolve, 0)); // or use a suitable timer if necessary
    expect(screen.queryByTestId('loading-popup')).not.toBeInTheDocument();

    // Check if the request error popup is now in the document
    expect(screen.getByTestId('request-error-popup')).toBeInTheDocument();
    expect(screen.getByTestId('request-error-popup-heading')).toHaveTextContent('Confirmation');
    expect(screen.getByTestId('request-error-popup-message')).toHaveTextContent('Error Sending Request');
    expect(screen.getByTestId('request-error-close-button')).toBeInTheDocument();
});

  it('renders the loading popup during submission and the success popup when the issue is successfully reported', async () => {
    // Mock createReportIssue to resolve successfully
    createReportIssue.mockResolvedValue({ value: 'Success' });
  
    renderWithQueryClient(<ReportIssue />);
  
    // Simulate filling in the form
    fireEvent.change(screen.getByTestId('issue-title-input'), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByTestId('issue-description-input'), { target: { value: 'Test Description' } });
  
    // Submit the form to trigger the loading popup
    fireEvent.click(screen.getByTestId('report-issue-button'));
      // Simulate confirmation to submit the form
    fireEvent.click(screen.getByTestId('confirmation-yes-button'));

    // Check for the loading popup immediately after submission
    expect(screen.getByTestId('loading-popup')).toBeInTheDocument();
    expect(screen.getByTestId('loading-popup-heading')).toHaveTextContent('Loading...');
    expect(screen.getByTestId('loading-popup-message')).toHaveTextContent('Please wait while we send your report.');

       // After a brief delay, check that the loading popup is gone
     await new Promise((resolve) => setTimeout(resolve, 0)); // or use a suitable timer if necessary
     expect(screen.queryByTestId('loading-popup')).not.toBeInTheDocument();

  
    // Check for the success popup after the submission resolves
    expect(await screen.findByTestId('success-popup')).toBeInTheDocument();
    expect(screen.getByTestId('success-popup-heading')).toHaveTextContent('Confirmation');
    expect(screen.getByTestId('success-popup-message')).toHaveTextContent('Your report has been sent');
    expect(screen.getByTestId('success-close-button')).toBeInTheDocument();
  
  });
  it('shows error popup when form is submitted with empty fields', () => {
    renderWithQueryClient(<ReportIssue />);

    fireEvent.submit(screen.getByTestId('report-issue-form'));

    expect(screen.getByTestId('error-popup')).toBeInTheDocument();
    expect(screen.getByTestId('error-popup-heading')).toHaveTextContent('Invalid Details');
    expect(screen.getByTestId('error-popup-message')).toHaveTextContent('Please fill in all fields');
  });

  it('navigates to the correct page when back button is clicked', () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    renderWithQueryClient(<ReportIssue />);

    fireEvent.click(screen.getByTestId('back-arrow-icon'));

    expect(navigate).toHaveBeenCalledWith("/student-home", {
      state: {
        SOURCE_PAGE: '/home',
        USER_ID: 1,
        DESTINATION_PAGE: undefined,
        CAMPUS_NAME: undefined,
        BUILDING_ID: 2,
        BUILDING_NAME: "Building A"
      }
    });
  });

    });