import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import LoginButton from '../../components/LoginButton/LoginButton';
import Logo from '../../assets/icons/WitsVenueTitle.svg';

//function to get users
async function list(id) {
    const endpoint = '/data-api/rest/USERS/USER_ID';
    const response = await fetch(`${endpoint}/${id}`);
    const data = await response.json();
    return data.value;
}

async function createUser(email,firstName,lastName) {
    const data = {
      USER_ID: email,
      FIRST_NAME: firstName,
      LAST_NAME:lastName,
      USER_ROLE: "Student"
    };
  
    const endpoint = `/data-api/rest/USERS/`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
  }

function LoginPage() {
    const {user, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDataAndNavigate = async () => {
            if (isAuthenticated) {//if authenticated then check if user is in db, if not, add them
                try {
                    const data=await list(user.email);
                    if(data.length===0){//user isnt in db, add them
                        createUser(user.email,user.given_name,user.family_name);
                    }
                    navigate('/profile'); // Navigate to the ProfilePage
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
