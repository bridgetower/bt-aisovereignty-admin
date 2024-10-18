import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthLayout } from '@/layout/AuthLayout';
import { DashboardLayout } from '@/layout/DashboardLayout';
import KnowledgeBaseWrapper from '@/layout/KnowledgeBaseWpper';
import { MainLayout } from '@/layout/MainLayout';
import Dashboard from '@/pages/dashboard/Dashboard';
import ForgotPassword from '@/pages/forgotPassword';
import { KnowledgeBaseContainer } from '@/pages/knowledgeBase/KnowledgeBase';
import { KnowledgeBaseWebsitesContainer } from '@/pages/knowledgeBase/KnowledgeBaseWebsites';
import ResetPassword from '@/pages/resetPassword';
import SignIn from '@/pages/signIn';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            {
              element: <SignIn />,
              path: '/sign-in',
            },
            {
              path: '/forgot-password',
              element: <ForgotPassword />,
            },
            {
              path: '/reset-password',
              element: <ResetPassword />,
            },
          ],
        },
        {
          element: <DashboardLayout />,
          children: [
            {
              path: '/',
              element: <KnowledgeBaseWrapper />,
              children: [
                {
                  path: '/',
                  element: <Dashboard />,
                },
                {
                  path: '/knowledgebase/documents',
                  element: <KnowledgeBaseContainer />,
                },
                {
                  path: '/knowledgebase/websites',
                  element: <KnowledgeBaseWebsitesContainer />,
                },
              ],
            },

            {
              path: '/dashboard',
              element: <Dashboard />,
            },

            {
              path: '*',
              element: (
                <div className="flex flex-col items-center justify-center">
                  <h1 className="text-2xl">404 Not Found</h1>
                  <p>Sorry, the page you are looking for does not exist.</p>
                </div>
              ),
            },
          ],
        },
      ],
    },
  ]);

  {
    return (
      <>
        <RouterProvider router={router} />
      </>
    );
  }
};
export default AppRouter;
