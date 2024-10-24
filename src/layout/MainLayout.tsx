import { ApolloProvider } from '@apollo/client';
import { Outlet } from 'react-router-dom'; // Import useLocation for route tracking

import { apolloClient } from '@/apollo/apolloClient';
import { Loader } from '@/components/common/Loader';
import { AuthProvider } from '@/context/CoginitoAuthProvider';
import { useLoader } from '@/context/LoaderProvider';
import { ThemeProvider } from '@/context/ThemeProvider';

export function MainLayout({ children }: { children?: React.ReactNode }) {
  const { isLoading } = useLoader();
  return (
    <ThemeProvider>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          {/* <DocKnowledgeBaseProvider> */}
          <Loader show={isLoading} />
          {children ?? <Outlet />}
          {/* </DocKnowledgeBaseProvider> */}
        </AuthProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}
