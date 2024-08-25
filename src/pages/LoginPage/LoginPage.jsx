import React from 'react';
import './LoginPage.css';

import LoginButton from '../../components/LoginButton/LoginButton';
import Logo from '../../assets/icons/WitsVenueTitle.svg';

function LoginPage() {
    return (
        <main className="centered-container">
            <section className="content-section">
                <div className="logo-container">
                    <img src={Logo} alt="WitsVenue Logo" className="logo" />
                </div>
                <p className="WellcomeText">Welcome!</p>
            <LoginButton />
            <p className='promt'>Can't sign in? <a href='https://www.wits.ac.za/about-wits/contact-us/'>Contact IT</a></p>

            </section>
        </main>
    );
}

export default LoginPage;
