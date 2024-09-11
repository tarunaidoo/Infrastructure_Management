import React from "react";
import "@testing-library/jest-dom";
import { render, fireEvent, waitFor,getByPlaceholderText,findByText,screen } from "@testing-library/react";
import ReportIssue from "./ReportIssue"; 
import { createReportIssue } from "../../services/ReportIssuePage/ReportIssuePage.service";
/**
 * Tests for the 'ReportIssue' component.
 * 
 * 
 * 1. Static Elements Rendering: Ensures that static elements such as headings, labels, and specific text contents (e.g., 'Venue:', 'MSL', 'MSL004') are rendered correctly.
 * 
 * 2. Heading and Back Arrow Icon: Confirms that the heading ("Report an Issue") and the back arrow icon (identified by alt text "back-arrow") are present in the document.
 * 
 * 3. Date and Venue Information: Checks that the date and venue details displayed are correct and match expected values.
 * 
 * 4. Date Formatting: Verifies that the date is formatted correctly according to the 'en-GB' locale and is displayed properly in the component.
 * 
 * 5. Submit Button and Icon: Ensures that the submit button with the text 'Report Issue' and the warning icon (identified by alt text "warning-icon") are rendered.
 * 
 * 6. Input Fields Rendering: Validates that input fields for issue title and description are present and rendered with appropriate placeholders.
 * 
 * 7. Input Fields Update: Tests that the issue title and description input fields correctly update their values when the user types into them.
 * 
 * 9. Form Validation: Checks that the `handleSubmit` function is not called if the form fields are empty upon submission.
 * 
 */

// Group tests related to the 'ReportIssue' component

jest.mock('../../services/ReportIssuePage/ReportIssuePage.service', () => ({
    createReportIssue: jest.fn(),
  }));
  afterEach(() => {
    jest.clearAllMocks();
});

describe("ReportIssue", () => {

    // Test default rendering
    it('renders static elements correctly', () => {
        // Render the component with a mock handleSubmit function
        const { getByText, getAllByText } = render(<ReportIssue handleSubmit={jest.fn()} />);
    
        // Assert that the heading is present in the document
        expect(getByText(/Report an Issue/i)).toBeInTheDocument();
        
        // Assert that the venue label is present in the document
        expect(getByText(/Venue:/i)).toBeInTheDocument();
        
        // Assert that there are exactly 2 elements with text 'Mathematical Science Labs'
        const buildingElements = getAllByText(/Mathematical Science Labs/i);
        expect(buildingElements.length).toBe(1); // There should be one occurrence of this text
    
        // Assert that there are exactly 1 element with text 'MSL004'
        const roomElements = getAllByText(/MSL004/i);
        expect(roomElements.length).toBe(1); // There should be one occurrence of this text
    
        // Assert that the room number is present in the document
        expect(roomElements[0]).toBeInTheDocument();
      });

    // Test to ensure the heading and back arrow icon are rendered correctly
    it("renders the heading and back arrow icon", () => {
        // Render the 'ReportIssue' component
        const { getByText, getByAltText } = render(<ReportIssue />);

        // Find the heading by its text content
        const heading = getByText("Report an Issue");

        // Find the back arrow icon by its alt text
        const backArrow = getByAltText("back-arrow");

        // Assert that both the heading and back arrow are in the document
        expect(heading).toBeInTheDocument();
        expect(backArrow).toBeInTheDocument();
    });

    // Test to ensure the date and venue information are displayed correctly
    it("displays the correct date and venue", () => {
        // Render the 'ReportIssue' component
        const { getByText } = render(<ReportIssue />);
    
        // Find the date and venue elements by their text content
        const dateElement = getByText(/Date: \d{2} [a-zA-Z]+ \d{4}/i); // Adjust regex if necessary
        const venueLabel = getByText("Venue:");
    
        // Find the venue details (adjust according to the component's actual content)
        const buildingElement = getByText("Mathematical Science Labs");
        const roomElement = getByText("MSL004");
    
        // Assert that the date, venue, building, and room elements are in the document
        expect(dateElement).toBeInTheDocument();
        expect(venueLabel).toBeInTheDocument();
        expect(buildingElement).toBeInTheDocument();
        expect(roomElement).toBeInTheDocument();
      });

    // Test date formatting
    it('displays the correct formatted date', () => {
        // Calculate the formatted date
        const formattedDate = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }).format(new Date());

        // Render the component
        const { getByText } = render(<ReportIssue handleSubmit={jest.fn()} />);

        // Assert that the formatted date is displayed correctly
        expect(getByText(`Date: ${formattedDate}`)).toBeInTheDocument();
    });

    // Test button rendering
    it('renders the submit button with correct text and icon', () => {
        // Render the component
        const { getByText, getByAltText } = render(<ReportIssue handleSubmit={jest.fn()} />);

        // Get the submit button and icon by their text and alt attributes
        const submitButton = getByText(/Report Issue/i);
        const warningIcon = getByAltText('warning-icon');

        // Assert that both the submit button and warning icon are present in the document
        expect(submitButton).toBeInTheDocument();
        expect(warningIcon).toBeInTheDocument();
    });

    // Test to ensure the input fields for issue title and description are rendered correctly
    it("renders the issue title and description inputs", () => {
        // Render the 'ReportIssue' component
        const { getByPlaceholderText } = render(<ReportIssue />);

        // Find the input fields by their placeholder text
        const issueTitleInput = getByPlaceholderText("Enter issue title here...");
        const issueDescriptionInput = getByPlaceholderText(
            "Describe the issue here..."
        );

        // Assert that both input fields are in the document
        expect(issueTitleInput).toBeInTheDocument();
        expect(issueDescriptionInput).toBeInTheDocument();
    });

    // Test to ensure the input fields update correctly when user types in them
    it("updates the issue title and description when user types", () => {
        // Render the 'ReportIssue' component
        const { getByPlaceholderText } = render(<ReportIssue />);

        // Find the input fields by their placeholder text
        const issueTitleInput = getByPlaceholderText("Enter issue title here...");
        const issueDescriptionInput = getByPlaceholderText(
            "Describe the issue here..."
        );

        // Simulate user typing in the issue title input field
        fireEvent.change(issueTitleInput, {
            target: { value: "Broken Projector" },
        });

        // Simulate user typing in the issue description input field
        fireEvent.change(issueDescriptionInput, {
            target: { value: "The projector in MSL004 is not working." },
        });

        // Assert that the input values have been updated correctly
        expect(issueTitleInput.value).toBe("Broken Projector");
        expect(issueDescriptionInput.value).toBe(
            "The projector in MSL004 is not working."
        );
    });

    // Test form input changes
    it('updates issue title and description on input change', () => {
        // Render the component
        const { getByPlaceholderText } = render(<ReportIssue handleSubmit={jest.fn()} />);

        // Get form inputs by their placeholder text
        const issueTitleInput = getByPlaceholderText('Enter issue title here...');
        const issueDescriptionInput = getByPlaceholderText('Describe the issue here...');

        // Simulate user typing in the form fields
        fireEvent.change(issueTitleInput, { target: { value: 'Test Issue Title' } });
        fireEvent.change(issueDescriptionInput, { target: { value: 'Test Issue Description' } });

        // Assert that the input fields contain the correct values
        expect(issueTitleInput.value).toBe('Test Issue Title');
        expect(issueDescriptionInput.value).toBe('Test Issue Description');
    });
    
    // Test form validation
    it('does not call handleSubmit if fields are empty', () => {
        // Mock the handleSubmit function
        const handleSubmit = jest.fn();
        // Render the component
        const { getByText } = render(<ReportIssue handleSubmit={handleSubmit} />);

        // Get the submit button by its text
        const submitButton = getByText(/Report Issue/i);

        // Simulate a form submission
        fireEvent.click(submitButton);

        // Assert that handleSubmit was not called because fields are empty
        expect(handleSubmit).not.toHaveBeenCalled();
    });

    it('calls handleFormSubmit when the form is submitted', async () => {
        // Mock API response
        createReportIssue.mockResolvedValueOnce({ success: true });
    
        // Render the ReportIssue component
        render(<ReportIssue />);
    
        // Get input fields and submit button
        const issueTitleInput = screen.getByPlaceholderText("Enter issue title here...");
        const issueDescriptionInput = screen.getByPlaceholderText("Describe the issue here...");
        const submitButton = await screen.findByText(/Report Issue/i);
    
        // Simulate user typing in the input fields
        fireEvent.change(issueTitleInput, { target: { value: "Broken Projector" } });
        fireEvent.change(issueDescriptionInput, { target: { value: "The projector in MSL004 is not working." } });
    
        // Simulate form submission
        fireEvent.click(submitButton);
    
        // Confirm the confirmation popup appears and simulate confirming
        const confirmButton = await screen.findByText(/Yes/i);
        fireEvent.click(confirmButton);
    
        // Ensure API is called
        expect(createReportIssue).toHaveBeenCalledTimes(1);
        expect(createReportIssue).toHaveBeenCalledWith({
            VENUE_ID: 1,
            TITLE: "Broken Projector",
            REPORTED_BY: "2486457@students.wits.ac.za",
            REPORT_DATE: expect.any(String),
            DESCRIPTION: "The projector in MSL004 is not working.",
            ISSUE_STATUS: "UNRESOLVED",
        });
    });
    it('handles API failure and shows error popup when the form is submitted', async () => {
        // Mock API rejection
        createReportIssue.mockRejectedValueOnce(new Error('Something went wrong'));
    
        // Render the ReportIssue component
        render(<ReportIssue />);
    
        // Get input fields and submit button
        const issueTitleInput = screen.getByPlaceholderText("Enter issue title here...");
        const issueDescriptionInput = screen.getByPlaceholderText("Describe the issue here...");
        const submitButton = await screen.findByText(/Report Issue/i);
    
        // Simulate user typing in the input fields
        fireEvent.change(issueTitleInput, { target: { value: "Broken Projector" } });
        fireEvent.change(issueDescriptionInput, { target: { value: "The projector in MSL004 is not working." } });
    
        // Simulate form submission
        fireEvent.click(submitButton);
    
        // Confirm the confirmation popup appears and simulate confirming
        const confirmButton = await screen.findByText(/Yes/i);
        fireEvent.click(confirmButton);
    
        // Check if error popup is displayed
        const errorPopup = await screen.findByText(/Error Sending Request/i);
        expect(errorPopup).toBeInTheDocument();
    
        // Ensure API is called
        expect(createReportIssue).toHaveBeenCalledTimes(1);
        expect(createReportIssue).toHaveBeenCalledWith({
            VENUE_ID: 1,
            TITLE:"Broken Projector",
            REPORTED_BY: "2486457@students.wits.ac.za",
            REPORT_DATE: expect.any(String),
            DESCRIPTION: "The projector in MSL004 is not working.",
            ISSUE_STATUS: "UNRESOLVED",
        });
});

test('displays success popup when issue is successfully reported', async () => {
    // Arrange: Mock successful report submission
    createReportIssue.mockResolvedValueOnce({}); // resolve the mock to simulate a successful report submission

    // Act: Render component and fill out the form
    render(<ReportIssue />);

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText(/Enter issue title here.../i), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe the issue here.../i), { target: { value: 'Test description' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Report Issue/i));

    // Confirm the issue report in the confirmation popup
    fireEvent.click(await screen.findByText(/Yes/i));

    // Assert: Check that the success popup appears after submission
    const successPopup = await screen.findByText(/Your report has been sent/i);
    expect(successPopup).toBeInTheDocument();
  });

  test('closes error popup when Close button is clicked', async () => {
    // Act: Render component and trigger error popup
    render(<ReportIssue />);
    
    // Submit the form without entering issue title or description to trigger the error popup
    fireEvent.click(screen.getByText(/Report Issue/i));
    
    // Assert: Error popup should be displayed
    const errorPopup = screen.getByText(/Invalid Details/i);
    expect(errorPopup).toBeInTheDocument();
    
    // Close the popup
    fireEvent.click(screen.getByText(/Close/i));
    
    // Assert: Popup should be closed (i.e., not in the document)
    expect(screen.queryByText(/Invalid Details/i)).not.toBeInTheDocument();
  });

  test('closes confirmation popup when No button is clicked', async () => {
    // Act: Render component and trigger confirmation popup
    render(<ReportIssue />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/Enter issue title here.../i), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe the issue here.../i), { target: { value: 'Test description' } });

    // Submit the form to trigger the confirmation popup
    fireEvent.click(screen.getByText(/Report Issue/i));

    // Assert: Confirmation popup should be displayed
    const confirmPopup = await screen.findByText(/Do you want to report this issue?/i);
    expect(confirmPopup).toBeInTheDocument();

    // Close the popup by clicking "No"
    fireEvent.click(screen.getByText(/No/i));

    // Assert: Popup should be closed (i.e., not in the document)
    expect(screen.queryByText(/Do you want to report this issue?/i)).not.toBeInTheDocument();
  });

  test('closes success popup when Close button is clicked', async () => {
    // Arrange: Mock successful report submission
    createReportIssue.mockResolvedValueOnce({});

    // Act: Render component and submit form
    render(<ReportIssue />);
    
    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText(/Enter issue title here.../i), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe the issue here.../i), { target: { value: 'Test description' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Report Issue/i));

    // Confirm the issue report in the confirmation popup
    fireEvent.click(await screen.findByText(/Yes/i));

    // Assert: Success popup should be displayed
    const successPopup = await screen.findByText(/Your report has been sent/i);
    expect(successPopup).toBeInTheDocument();

    // Close the success popup
    fireEvent.click(screen.getByText(/Close/i));

    // Assert: Popup should be closed (i.e., not in the document)
    expect(screen.queryByText(/Your report has been sent/i)).not.toBeInTheDocument();
  });

  test('closes request-error popup when Close button is clicked', async () => {
    // Arrange: Mock failed report submission
    createReportIssue.mockRejectedValueOnce({});

    // Act: Render component and submit form
    render(<ReportIssue />);

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText(/Enter issue title here.../i), { target: { value: 'Test Issue' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe the issue here.../i), { target: { value: 'Test description' } });

    // Submit the form
    fireEvent.click(screen.getByText(/Report Issue/i));

    // Confirm the issue report in the confirmation popup
    fireEvent.click(await screen.findByText(/Yes/i));

    // Assert: Request-error popup should be displayed
    const requestErrorPopup = await screen.findByText(/Error Sending Request/i);
    expect(requestErrorPopup).toBeInTheDocument();

    // Close the request-error popup
    fireEvent.click(screen.getByText(/Close/i));

    // Assert: Popup should be closed (i.e., not in the document)
    expect(screen.queryByText(/Error Sending Request/i)).not.toBeInTheDocument();
  });
});

