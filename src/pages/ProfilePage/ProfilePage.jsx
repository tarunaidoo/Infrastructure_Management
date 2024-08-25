import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './ProfilePage.css'
import NaigationHeader from '../../components/NavigationHeader/NavigationHeader'

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && user && (<>
        <NaigationHeader title="User Profile" />
      <div className="profile_container">
        <img 
        src={user.picture} 
        alt={user.name} 
        onError={(e) => { 
            e.target.src = "fallback-image-url.jpg"; // had problems using user.image but this on error fixes it
        }} 
        />
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <a href="https://www.wits.ac.za/about-wits/contact-us/">Contact Wits ICT</a>
      </div>
      </>
    )
  );
};

export default Profile;
