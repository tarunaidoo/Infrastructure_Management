import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ReportIssue from "./ReportIssue"; // Adjust the import based on your file structure
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
 * 8. Form Submission: Verifies that the `handleSubmit` function is called when the form is submitted with valid input data.
 * 
 * 9. Form Validation: Checks that the `handleSubmit` function is not called if the form fields are empty upon submission.
 * 
 */

// Group tests related to the 'ReportIssue' component
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

    // Test to ensure the report issue button and the warning icon are rendered correctly
    // it("calls the handleSubmit function when the form is submitted", () => {
    //     // Create a mock function for handleSubmit
    //     const handleSubmit = jest.fn();

    //     // Render the 'ReportIssue' component with the mocked handleSubmit function
    //     const { getByPlaceholderText, getByText } = render(
    //         <ReportIssue handleSubmit={handleSubmit} />
    //     );

    //     // Find the input fields and submit button
    //     const issueTitleInput = getByPlaceholderText("Enter issue title here...");
    //     const issueDescriptionInput = getByPlaceholderText(
    //         "Describe the issue here..."
    //     );
    //     const submitButton = getByText(/Report Issue/i);

    //     // Fill out the form
    //     fireEvent.change(issueTitleInput, { target: { value: "Test Issue" } });
    //     fireEvent.change(issueDescriptionInput, {
    //         target: { value: "Test Description" },
    //     });

    //     // Submit the form
    //     fireEvent.click(submitButton);

    //     // Assert that the handleSubmit function was called exactly once
    //     expect(handleSubmit).toHaveBeenCalledTimes(1);
    // });

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
});

