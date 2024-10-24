// ProjectComponentWrapper.tsx
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { ProjectContextProvider } from '@/context/ProjectProvider';

type ProjectComponentWrapperProps = {
  children?: ReactNode;
};

const ProjectComponentWrapper: React.FC<ProjectComponentWrapperProps> = ({
  children,
}) => {
  return (
    <ProjectContextProvider>{children ?? <Outlet />}</ProjectContextProvider>
  );
};

export default ProjectComponentWrapper;
