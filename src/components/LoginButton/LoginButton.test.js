import React from 'react';
import {render,screen,cleanup} from '@testing-library/react'
import LoginButton from './LoginButton'
import '@testing-library/jest-dom';

test('should render LoginButton',()=>{
    render(<LoginButton/>);
    const LoginButtonElement=screen.getByTestId('LoginButton-1');
    expect(LoginButtonElement).toBeInTheDocument();
})