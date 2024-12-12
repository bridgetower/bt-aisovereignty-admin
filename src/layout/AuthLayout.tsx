import { Navigate, Outlet } from 'react-router-dom'; // Import useLocation for route tracking

import { SignInBanner } from '@/components/common/signinBanner';
import { useAuth } from '@/context/CoginitoAuthProvider';

export function AuthLayout({ children }: { children?: React.ReactNode }) {
  const { dbUser, session } = useAuth();

  // if (dbUser) {
  //   return <Navigate to="/" />;
  // }
  if (session && session.isValid() && dbUser) {
    console.log(location.pathname);

    return <Navigate to={'/'} />;
  }
  return (
    <SignInBanner>
      {children ?? <Outlet />}
      {/* <main className="w-screen min-h-screen bg-background">
        <AuthNavbar />

      </main> */}
    </SignInBanner>
  );
}
