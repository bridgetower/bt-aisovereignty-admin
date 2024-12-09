import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

import { ErrorFallback } from '@/components/common/ErrorBoundary';
import { AuthLayout } from '@/layout/AuthLayout';
import { DashboardLayout } from '@/layout/DashboardLayout';
import KnowledgeBaseWrapper from '@/layout/KnowledgeBaseWrapper';
import { MainLayout } from '@/layout/MainLayout';
import ProjectComponentWrapper from '@/layout/ProjectComponentWrapper';
import Dashboard from '@/pages/dashboard/Dashboard';
import ForgotPassword from '@/pages/forgotPassword';
import { KnowledgeBaseContainer } from '@/pages/knowledgeBase/KnowledgeBase';
import { KnowledgeBaseWebsitesContainer } from '@/pages/knowledgeBase/KnowledgeBaseWebsites';
import { ProjectList } from '@/pages/Projects/Projects';
import ResetPassword from '@/pages/resetPassword';
import SignIn from '@/pages/signIn';
import { StageTypeList } from '@/pages/stageType/StageTypes';
import { StepTypeList } from '@/pages/stepType/StepTypes';
import { UserSFileRequestList } from '@/pages/usersFileRequest/UsersFileRequestList';

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      errorElement: <ErrorFallback />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            { path: '/sign-in', element: <SignIn /> },
            { path: '/forgot-password', element: <ForgotPassword /> },
            { path: '/reset-password', element: <ResetPassword /> },
          ],
        },
        {
          element: <DashboardLayout />,
          children: [
            {
              path: '/',
              element: <ProjectComponentWrapper />,
              children: [
                { path: '/', element: <Navigate to="/projects" replace /> },
                { path: '/projects', element: <ProjectList /> },
                { path: '/projects/:action/:id?', element: <ProjectList /> },
              ],
            },
            {
              path: '/knowledgebase',
              element: <KnowledgeBaseWrapper />,
              children: [
                { path: 'documents', element: <KnowledgeBaseContainer /> },
                {
                  path: 'websites',
                  element: <KnowledgeBaseWebsitesContainer />,
                },
              ],
            },
            { path: '/dashboard', element: <Dashboard /> },
            { path: '/stage-types', element: <StageTypeList /> },
            { path: '/step-types', element: <StepTypeList /> },
            { path: 'add-file-request', element: <UserSFileRequestList /> },
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

  return <RouterProvider router={router} />;
};

export default AppRouter;
