import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './LogOutButton.css';

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // Log out and navigate to the "/" page
    logout({
      returnTo: window.location.origin // Redirects to home page "/"
    });

    // After logging out, replace the history to prevent back navigation
    setTimeout(() => {
      window.location.replace(`${window.location.origin}/`);
    }, 100); // Small delay to allow logout to complete

    // Clear the session history after logout
    localStorage.clear();
    window.history.pushState(null, null, window.location.href);
    window.history.go(1); // Prevent back button
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton;
