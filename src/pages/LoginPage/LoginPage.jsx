import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

import './LoginPage.css';
import LoginButton from '../../components/LoginButton/LoginButton';
import Logo from '../../assets/icons/WitsVenueTitle.svg';
import {list,createUser} from '../../services/LoginPage.service'


function LoginPage() {
    const {user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataAndNavigate = async () => {
            if (isAuthenticated) {//if authenticated then check if user is in db, if not, add them
                try {
                    const data=await list(user.email);
                    if(data.length===0){//user isnt in db, add them, only applies to a student, admin already in db
                        createUser(user.email,user.given_name,user.family_name);
                    }
                    if(data[0].USER_ROLE==="Admin"){
                        navigate('/admin-home'); //navigate to the admin home 
                    }
                    else{
                        localStorage.setItem('showPopupOnStudentHome', 'true');
                        localStorage.setItem('userEmail', user.email);//
                        navigate('/student-home'); // Navigate to the student home
                    }
                    
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchDataAndNavigate();
    }, [isAuthenticated, user?.email, user?.given_name, user?.family_name, navigate]);

    return (
        <main className="centered-container">
            <section className="content-section">
                <div className="logo-container">
                    <img src={Logo} alt="WitsVenue Logo" className="logo" />
                </div>
                <p className="WellcomeText">Welcome!</p>
                {!isAuthenticated && <LoginButton />}
                <p className='promt'>Can't sign in? <a href='https://www.wits.ac.za/about-wits/contact-us/'>Contact IT</a></p>
            </section>
        </main>
    );
}

export default LoginPage;
