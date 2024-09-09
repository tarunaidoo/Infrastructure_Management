import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReportedIssuePopup from './PopUpIssuesReported';

describe('ReportedIssuePopup Component', () => {
    const mockProps = {
        issueID: '12345',
        user: 'John Doe',
        reportDate: 'Mon Sep 09 2024',
        resolvedDate: null,
        venueName: 'Room101',
        description: 'Projector malfunctioning',
        status: 'Pending',
        onResolve: jest.fn(),
        onClose: jest.fn(),
    };

    test('renders the popup with correct content', () => {
        render(<ReportedIssuePopup {...mockProps} />);

        expect(screen.getByTestId('issueID')).toHaveTextContent(`Issue No: ${mockProps.issueID}`);
        expect(screen.getByTestId('reportedBy')).toHaveTextContent(`Reported By: ${mockProps.user}`);
        expect(screen.getByTestId('reportDate')).toHaveTextContent(`Report Date: ${mockProps.reportDate}`);
        expect(screen.getByTestId('resolvedDate')).toHaveTextContent('Resolved Date: Unresolved');
        expect(screen.getByTestId('venueName')).toHaveTextContent(`Venue: ${mockProps.venueName}`);
        expect(screen.getByTestId('description')).toHaveTextContent(`Description: ${mockProps.description}`);
        expect(screen.getByTestId('status')).toHaveTextContent(`Status: ${mockProps.status}`);
    });

    test('calls onResolve when the resolve button is clicked', () => {
        render(<ReportedIssuePopup {...mockProps} />);

        const resolveButton = screen.getByTestId('resolveButton');
        fireEvent.click(resolveButton);

        // Ensure the onResolve function was called
        expect(mockProps.onResolve).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when the close button is clicked', () => {
        render(<ReportedIssuePopup {...mockProps} />);

        const closeButton = screen.getByTestId('closeButton');
        fireEvent.click(closeButton);

        // Ensure the onClose function was called
        expect(mockProps.onClose).toHaveBeenCalledTimes(1);
    });

    test('has the correct test id for the popup', () => {
        render(<ReportedIssuePopup {...mockProps} />);
        
        const popupElement = screen.getByTestId('popIssues-1');
        expect(popupElement).toBeInTheDocument();
    });
});
