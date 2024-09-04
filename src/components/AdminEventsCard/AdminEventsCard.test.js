import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminEventsCard from './AdminEventsCard';

test('should render adminEventsCard component', ()=>{
    render(<AdminEventsCard/>);
    const adminEventsCardElement = screen.getByTestId('AdminEventsCard-1');
    expect(adminEventsCardElement).toBeInTheDocument();
});