import { from, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

import { getLogoutFunction } from '../context/CoginitoAuthProvider';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const logout = getLogoutFunction();
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (extensions && extensions.code === 'UNAUTHENTICATED') {
        logout();
      }
      console.log(message, locations, path);
    });
  }
  console.log('networkError', networkError);
  const networkErrors = networkError as any;
  if (networkErrors && networkErrors?.statusCode === 401) {
    logout();
  }
});

const httpLink = new HttpLink({
  uri: 'https://etjvxhmjmjagtbsyhtf5lt5azm.appsync-api.us-east-1.amazonaws.com/graphql',
  headers: {
    Authorization: process.env.REACT_APP_TANENT_API_KEY || '',
    identity: localStorage.getItem('idToken') || '',
  },
});
// Combine error link and http link
export const AuthMiddleware = from([errorLink, httpLink]);
