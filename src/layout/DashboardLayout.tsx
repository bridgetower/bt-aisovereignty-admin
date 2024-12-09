import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation for route tracking
import { useLocalStorage, useMediaQuery } from 'usehooks-ts';

import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/CoginitoAuthProvider';
import { DashboardProvider } from '@/context/DashboardProvider';

export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const { dbUser, session } = useAuth();

  const [navOpen, setNavOpen] = useState(true);
  const [sidebarOpen, setSideOpen] = useState(false);
  const [recentPages, setRecentPages] = useLocalStorage<string[]>(
    'recent-pages',
    [],
  );
  const location = useLocation();
  const navigate = useNavigate();
  const isMatches = useMediaQuery('(min-width: 1080px)');

  // Track the recent page visits
  useEffect(() => {
    const currentPath = location.pathname;

    // Only add the page if it's not the same as the last visited
    if (recentPages[0] !== currentPath) {
      const last = recentPages.filter((page) => page !== currentPath);
      const updatedPages = [currentPath, ...last].slice(0, 5); // Ensure only 5 items
      setRecentPages(updatedPages);
    }
  }, [location, setRecentPages]); // Trigger on location (route) change

  useEffect(() => {
    if (!isMatches) {
      setNavOpen(false);
      setSideOpen(false);
    }
  }, [isMatches]);

  // if (!session || !session.isValid() || !dbUser) {
  // if (!dbUser) {
  //   return <Navigate to="/sign-in" />;
  // }
  useEffect(() => {
    const isLoogerIn = localStorage.getItem('idToken');
    if (!dbUser && !isLoogerIn) {
      navigate('/sign-in');
    }
  }, [location]);
  return (
    <DashboardProvider>
      <main
        className={clsx(
          'relative w-screen max-w-screen min-h-screen overflow-hidden flex bg-background text-foreground transition-all duration-300',
        )}
      >
        <div
          className={clsx(
            'h-screen w-[212px] min-w-[212px] -ml-[212px] border-r border-muted transition-all duration-300 z-20 bg-navbackground shadow-',
            {
              '!ml-0': navOpen,
            },
          )}
        >
          <Sidebar />
        </div>

        <div className="relative flex-1 min-w-[416px] flex flex-col min-h-screen">
          <Navbar setSideOpen={setSideOpen} setNavOpen={setNavOpen} />
          <ScrollArea className="h-[calc(100vh-64px)] p-4">
            {children ?? <Outlet />}
          </ScrollArea>
        </div>

        {/* <ScrollArea
        className={clsx(
          'w-[280px] min-w-[280px] h-screen p-4 -mr-[280px] border-l border-white/10 transition-all duration-300 ease-out z-30',
          {
            '!mr-0': sidebarOpen,
          },
        )}
      >
        <Notifications
          notificationData={notificationsData}
          activitiesData={activitiesData}
        />
      </ScrollArea> */}
      </main>
    </DashboardProvider>
  );
}
