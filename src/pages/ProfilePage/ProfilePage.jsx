import React from "react";
import './ProfilePage.css'
import NaigationHeader from '../../components/NavigationHeader/NavigationHeader'
import LogoutButton from "../../components/LogOutButton/LogOutButton";
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const user = JSON.parse(localStorage.getItem('user'));

  const navigate=useNavigate();
  const handleback=()=>{
    //navigate("/student-home");
    navigate(-1); //possible fix as '-1' goes back to previous page - so useful for navigating back to whichever page user came from
  }


  return (
      <>
        <NaigationHeader title="User Profile" onClick={handleback}/>
      <main className="profile_container">
        <img 
        src={user.picture} 
        alt={user.name} 
        onError={(e) => { 
            e.target.src = "fallback-image-url.jpg"; // had problems using user.image but this on error fixes it
        }} 
        />
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <article className="logout-container">
        <LogoutButton/>
        </article>
        <a href="https://www.wits.ac.za/about-wits/contact-us/">Contact Wits ICT</a>
        
      </main>
      </>
  );
};

export default Profile;
