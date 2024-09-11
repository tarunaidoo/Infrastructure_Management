import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from "react-query";

import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const queryClient = new QueryClient();

ReactDOM.render(
  <Auth0Provider
    domain="dev-db0zyxrziyqogi48.us.auth0.com"
    clientId="WztTTE9jAlLWYlL2tDLexMRbKdRWBSGk"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
  
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>

  </Auth0Provider>,
  document.getElementById('root')
);
