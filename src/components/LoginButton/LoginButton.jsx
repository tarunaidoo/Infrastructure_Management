import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './LoginButton.css';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button data-testid="LoginButton-1" className="login-button" onClick={() => loginWithRedirect()}>Log In / Sign up</button>;
};

export default LoginButton;
