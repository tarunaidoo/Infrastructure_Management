import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminIssuesCard from './AdminIssuesCard';

test('should render adminEventsCard component', ()=>{
    render(<AdminIssuesCard/>);
    const adminEventsCardElement = screen.getByTestId('AdminIssuesCard-1');
    expect(adminEventsCardElement).toBeInTheDocument();
});