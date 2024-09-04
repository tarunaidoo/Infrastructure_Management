import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Popup from './AddVenuePopup';

describe('AddVenuePopup Component', () => {

    test('renders popup with Confirmation heading and buttons', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(<Popup onConfirm={onConfirm} onCancel={onCancel} />);
        
        // Check if heading and message are rendered
        expect(screen.getByText('Confirmation')).toBeInTheDocument();
        expect(screen.getByText('Do you want to add this venue?')).toBeInTheDocument();
        
        // Check if buttons are rendered
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });
    
    test('calls onConfirm when Yes button is clicked', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(<Popup onConfirm={onConfirm} onCancel={onCancel} />);
        
        fireEvent.click(screen.getByText('Yes'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
    
    test('calls onCancel when No button is clicked', () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(<Popup onConfirm={onConfirm} onCancel={onCancel} />);
        
        fireEvent.click(screen.getByText('No'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

});
