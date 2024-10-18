import { ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom'; // Import useLocation for route tracking

import { apolloClient } from '@/apollo/apolloClient';
import { AuthProvider } from '@/context/CoginitoAuthProvider';
import { ThemeProvider } from '@/context/ThemeProvider';

export function MainLayout({ children }: { children?: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          {/* <DocKnowledgeBaseProvider> */}
          {children ?? <Outlet />}
          {/* </DocKnowledgeBaseProvider> */}
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
