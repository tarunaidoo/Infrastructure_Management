import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';


ReactDOM.render(
  <Auth0Provider
    domain="dev-db0zyxrziyqogi48.us.auth0.com"
    clientId="WztTTE9jAlLWYlL2tDLexMRbKdRWBSGk"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >

    <App />

  </Auth0Provider>,
  document.getElementById('root')
);
