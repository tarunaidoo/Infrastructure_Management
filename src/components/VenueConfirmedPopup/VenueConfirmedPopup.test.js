import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Popup from './VenueConfirmedPopup';

describe('Popup Component', () => {

    test('renders confirmation popup with Yes and No buttons', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(<Popup type="confirmation" onConfirm={onConfirm} onCancel={onCancel} />);
        
        // Check if heading and message are rendered
        expect(screen.getByText('Confirmation')).toBeInTheDocument();
        expect(screen.getByText('Do you want to add this venue?')).toBeInTheDocument();
        
        // Check if buttons are rendered
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });
    
    test('renders confirmed popup with Close button', () => {
        const onClose = jest.fn();
        
        render(<Popup type="confirmed" onClose={onClose} />);
        
        // Check if heading and message are rendered
        expect(screen.getByText('Confirmed!')).toBeInTheDocument();
        expect(screen.getByText('The venue has been added.')).toBeInTheDocument();
        
        // Check if Close button is rendered
        expect(screen.getByText('Close')).toBeInTheDocument();
    });
    
    test('renders invalid popup with Close button', () => {
        const onClose = jest.fn();
        
        render(<Popup type="invalid" onClose={onClose} />);
        
        // Check if heading and message are rendered
        expect(screen.getByText('Invalid details')).toBeInTheDocument();
        expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
        
        // Check if Close button is rendered
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    test('calls onConfirm when Yes button is clicked in confirmation popup', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(<Popup type="confirmation" onConfirm={onConfirm} onCancel={onCancel} />);
        
        fireEvent.click(screen.getByText('Yes'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    test('calls onCancel when No button is clicked in confirmation popup', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(<Popup type="confirmation" onConfirm={onConfirm} onCancel={onCancel} />);
        
        fireEvent.click(screen.getByText('No'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Close button is clicked in confirmed popup', () => {
        const onClose = jest.fn();
        
        render(<Popup type="confirmed" onClose={onClose} />);
        
        fireEvent.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Close button is clicked in invalid popup', () => {
        const onClose = jest.fn();
        
        render(<Popup type="invalid" onClose={onClose} />);
        
        fireEvent.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

});
