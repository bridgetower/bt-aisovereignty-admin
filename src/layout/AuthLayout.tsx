import { Navigate, Outlet } from 'react-router-dom'; // Import useLocation for route tracking

import AuthNavbar from '@/components/common/AuthNavbar';
import { useAuth } from '@/context/CoginitoAuthProvider';

export function AuthLayout({ children }: { children?: React.ReactNode }) {
  const { dbUser } = useAuth();

  if (dbUser) {
    return <Navigate to="/" />;
  }
  return (
    <main className="w-screen min-h-screen dark:bg-[#2A2A2A]">
      <AuthNavbar />

      {children ?? <Outlet />}
    </main>
  );
}
