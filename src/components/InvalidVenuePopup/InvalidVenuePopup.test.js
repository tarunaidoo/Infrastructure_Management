import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // for the `toBeInTheDocument` matcher
import Popup from './InvalidVenuePopup';

describe('Popup Component', () => {
    
    test('renders confirmation popup with Yes and No buttons', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(<Popup type="confirmation" onConfirm={onConfirm} onCancel={onCancel} />);
        
        expect(screen.getByText('Confirmation')).toBeInTheDocument();
        expect(screen.getByText('Do you want to add this venue?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Yes'));
        expect(onConfirm).toHaveBeenCalled();
        
        fireEvent.click(screen.getByText('No'));
        expect(onCancel).toHaveBeenCalled();
    });
    
    test('renders confirmed popup with Close button', () => {
        const onClose = jest.fn();
        
        render(<Popup type="confirmed" onConfirm={() => {}} onCancel={() => {}} onClose={onClose} />);
        
        expect(screen.getByText('Confirmed!')).toBeInTheDocument();
        expect(screen.getByText('The venue has been added.')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalled();
    });

    test('renders invalid popup with Close button', () => {
        const onClose = jest.fn();
        
        render(<Popup type="invalid" onConfirm={() => {}} onCancel={() => {}} onClose={onClose} />);
        
        expect(screen.getByText('Invalid details')).toBeInTheDocument();
        expect(screen.getByText('Please fill in all fields.')).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
        
        fireEvent.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalled();
    });

});
